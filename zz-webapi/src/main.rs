// #![forbid(clippy::unwrap_used)]

use core::{book::book_routes, element::elements_routes, utils::ApiManager, wizform::wizform_routes};

use async_graphql::{http::GraphiQLSource, EmptyMutation, EmptySubscription, Schema};
use async_graphql_axum::GraphQL;
use axum::{http::Method, response::{Html, IntoResponse}, routing::{get, get_service, post_service}, Extension, Router};
use graphql::query::Query;
use sea_orm::SqlxPostgresConnector;
use services::book::service::WizformService;
use tower_http::cors::{Any, CorsLayer};

mod core;
mod services;
mod graphql;
mod error;

async fn graphiql() -> impl IntoResponse {
    Html(
        GraphiQLSource::build().endpoint("/").subscription_endpoint("/ws").finish(),
    )
}

#[shuttle_runtime::main]
async fn main(
    #[shuttle_shared_db::Postgres] pool: sqlx::PgPool,
    #[shuttle_runtime::Secrets] secrets: shuttle_runtime::SecretStore
) -> shuttle_axum::ShuttleAxum {
    let manager = ApiManager {
        pool: pool.clone()
    };
    let db = SqlxPostgresConnector::from_sqlx_postgres_pool(pool);
    let schema = Schema::build(Query, EmptyMutation, EmptySubscription)
        .data(db)
        .data(WizformService {})
        .finish();
    tracing::info!("Tracing ok?");

    let router = Router::new()
        .route("/", get(graphiql).post_service(GraphQL::new(schema.clone())))
        .merge(wizform_routes())
        .merge(elements_routes())
        .merge(book_routes())
        .with_state(manager)
        .layer(CorsLayer::new().allow_origin(Any).allow_methods([Method::GET, Method::POST]).allow_headers(Any));

    Ok(router.into())
}
