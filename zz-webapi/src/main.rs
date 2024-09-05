use axum::{routing::get, Router};
use book::book_creation_handler;

pub mod book;

async fn hello_world() -> &'static str {
    "Hello, world!"
}

#[derive(Clone)]
pub struct ApiManager {
    pub pool: sqlx::PgPool
}

#[shuttle_runtime::main]
async fn main(
    #[shuttle_shared_db::Postgres] db: sqlx::PgPool
) -> shuttle_axum::ShuttleAxum {
    //sqlx::migrate!().run(&db).await.unwrap();
    let manager = ApiManager {
        pool: db
    };
    let router = Router::new()
        .route("/", get(hello_world))
        .route("/books/create", get(book_creation_handler))
        .with_state(manager);
    Ok(router.into())
}
