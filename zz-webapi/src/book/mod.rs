use axum::{
    extract::State, 
    http::StatusCode, 
    response::IntoResponse, 
    Json
};

use zz_data::book::base::BookCreationParams;

use crate::ApiManager;

pub mod routes;
mod source;

pub async fn book_creation_handler(
    State(api_manager) : State<ApiManager>,
    Json(book_to_create): Json<BookCreationParams>
) -> impl IntoResponse {
    let _res = sqlx::query(
        r#"
            INSERT INTO books 
            (id, name)
            VALUES($1, $2)
        "#)
        .bind(book_to_create.id)
        .bind(book_to_create.name)
        .execute(&api_manager.pool)
        .await
        .unwrap();
    (StatusCode::OK, "Ok".to_string())
}