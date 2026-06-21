use crate::error::ZZApiError;
use axum::response::IntoResponse;
use serde::{Deserialize, Serialize};
use shared_gen::*;

mod error;
mod services;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub email: String,
    pub password: String,
}

#[tokio::main]
async fn main() -> Result<(), ZZApiError> {
    dotenv::dotenv().ok();
    let addr = format!("[::1]:{}", std::env::var("PORT")?).parse().unwrap();
    let db_connection = sea_orm::Database::connect(std::env::var("DB_URL")?).await?;
    let book_service = services::book::repo::BookServiceImpl::new(db_connection.clone());
    let editor_service = services::editor::EditorServiceImpl::new(db_connection);
    tonic::transport::Server::builder()
        .add_service(book_service::book_service_server::BookServiceServer::new(book_service))
        .add_service(editor_service::editor_service_server::EditorServiceServer::new(editor_service))
        .serve(addr)
        .await?;
    Ok(())
}