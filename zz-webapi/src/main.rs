use axum::{routing::{get, post}, Router};
use drive::{get_file, DropboxConnector};
use shuttle_runtime::SecretStore;
use core::{book::book_routes, element::elements_routes, utils::ApiManager, wizform::wizform_routes};
use std::sync::Arc;

mod core;
mod drive;

async fn hello_world() -> &'static str {
    "Hello, world!"
}

#[shuttle_runtime::main]
async fn main(
    #[shuttle_shared_db::Postgres] db: sqlx::PgPool,
    #[shuttle_runtime::Secrets] secrets: shuttle_runtime::SecretStore
) -> shuttle_axum::ShuttleAxum {
    let db_client = DropboxConnector::new(&secrets);
    let manager = ApiManager {
        pool: db,
        drive: Arc::new(db_client)
    };
    tracing::info!("Tracing ok?");
    let router = Router::new()
        .route("/", get(hello_world))
        .route("/upload", post(get_file))
        .merge(wizform_routes())
        .merge(elements_routes())
        .merge(book_routes())
        .with_state(manager);
    Ok(router.into())
}
