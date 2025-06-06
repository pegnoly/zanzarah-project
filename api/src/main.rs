// #![forbid(clippy::unwrap_used)]

use core::{
    book::book_routes, element::elements_routes, utils::ApiManager, wizform::wizform_routes,
};

use async_graphql::{EmptySubscription, Schema, http::GraphiQLSource};
use async_graphql_axum::GraphQL;
use axum::{
    Router,
    http::Method,
    response::{Html, IntoResponse},
    routing::get,
};
use graphql::{MutationRoot, QueryRoot, query::Query};
use jsonwebtoken::{DecodingKey, EncodingKey};
use sea_orm::SqlxPostgresConnector;
use serde::{Deserialize, Serialize};
use services::{auth::prelude::AuthRepository, book::repo::BookRepository};
use tower_http::cors::{Any, CorsLayer};

mod core;
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
    #[shuttle_shared_db::Postgres] pool: sqlx::PgPool,
    #[shuttle_runtime::Secrets] secrets: shuttle_runtime::SecretStore,
) -> shuttle_axum::ShuttleAxum {
    let jwt_validator = secrets.get("JWT_SECRET_VALIDATOR").unwrap();
    let manager = ApiManager {
        pool: pool.clone(),
        encoding_key: EncodingKey::from_secret(jwt_validator.as_bytes()),
        decoding_key: DecodingKey::from_secret(jwt_validator.as_bytes()),
    };
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
        .merge(wizform_routes())
        .merge(elements_routes())
        .merge(book_routes())
        .with_state(manager)
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods([Method::GET, Method::POST])
                .allow_headers(Any),
        );

    Ok(router.into())
}