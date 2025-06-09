// #![forbid(clippy::unwrap_used)]
use async_graphql::{EmptySubscription, Schema, http::GraphiQLSource};
use async_graphql_axum::GraphQL;
use axum::{
    Router,
    http::Method,
    response::{Html, IntoResponse},
    routing::get,
};
use graphql::{MutationRoot, QueryRoot, query::Query};
use sea_orm::SqlxPostgresConnector;
use serde::{Deserialize, Serialize};
use services::{auth::prelude::AuthRepository, book::repo::BookRepository};
use tower_http::cors::{Any, CorsLayer};

mod error;
mod graphql;
mod services;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub email: String,
    pub password: String,
}

async fn graphiql() -> impl IntoResponse {
    Html(
        GraphiQLSource::build()
            .endpoint("/")
            .subscription_endpoint("/ws")
            .finish(),
    )
}

#[shuttle_runtime::main]
async fn main(
    #[shuttle_shared_db::Postgres(
        local_uri = "postgres://user_{secrets.POSTGRES_USER}:{secrets.POSTGRES_PASSWORD}@sharedpg-rds.shuttle.dev:5432/db_{secrets.POSTGRES_USER}"
    )] pool: sqlx::PgPool,
    #[shuttle_runtime::Secrets] secrets: shuttle_runtime::SecretStore,
) -> shuttle_axum::ShuttleAxum {
    let db = SqlxPostgresConnector::from_sqlx_postgres_pool(pool);
    let schema = Schema::build(
        QueryRoot::default(),
        MutationRoot::default(),
        EmptySubscription,
    )
    .data(db)
    .data(BookRepository)
    .data(AuthRepository::new(&secrets).map_err(|err| shuttle_runtime::Error::Custom(err.into()))?)
    .finish();
    tracing::info!("Tracing ok?");

    let router = Router::new()
        .route(
            "/",
            get(graphiql).post_service(GraphQL::new(schema.clone())),
        )
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods([Method::GET, Method::POST])
                .allow_headers(Any),
        );

    Ok(router.into())
}