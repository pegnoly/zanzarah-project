use axum::{
    routing::{
        get, 
        patch, 
        post
    }, 
    Router
};
use book::{
    create_book, 
    get_book, 
    get_existing_elements, 
    get_existing_wizforms, 
    initialize_book, 
    load_all_wizforms, 
    update_element, 
    update_wizform
};

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
    let manager = ApiManager {
        pool: db
    };
    tracing::info!("Tracing ok?");
    let router = Router::new()
        .route("/", get(hello_world))
        .route("/book", post(create_book))
        .route("/book", get(get_book))
        .route("/book/initialize", patch(initialize_book))
        .route("/wizforms", get(get_existing_wizforms))
        .route("/wizforms", post(load_all_wizforms))
        .route("/elements", get(get_existing_elements))
        .route("/wizform", patch(update_wizform))
        .route("/element", patch(update_element))
        .with_state(manager);
    Ok(router.into())
}
