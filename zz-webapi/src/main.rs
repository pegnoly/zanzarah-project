use axum::{extract::State, routing::{get, post}, Router};
use shuttle_runtime::SecretStore;
use core::{book::book_routes, element::elements_routes, utils::ApiManager, wizform::wizform_routes};
use std::sync::Arc;

mod core;

async fn hello_world() -> &'static str {
    "Hello, world!"
}

#[shuttle_runtime::main]
async fn main(
    #[shuttle_shared_db::Postgres] db: sqlx::PgPool,
    #[shuttle_runtime::Secrets] secrets: shuttle_runtime::SecretStore
) -> shuttle_axum::ShuttleAxum {
    let manager = ApiManager {
        pool: db
    };
    tracing::info!("Tracing ok?");
    let router = Router::new()
        .route("/", get(hello_world))
        .merge(wizform_routes())
        .merge(elements_routes())
        .merge(book_routes())
        .with_state(manager);
    Ok(router.into())
}
