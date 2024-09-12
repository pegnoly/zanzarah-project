use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::{get, patch, post}, Json, Router};
use zz_data::book::base::{Book, BookCreationParams, WizformFilterDBModel};

use super::utils::{ApiManager, StringOptionPayload, StringPayload};

pub(crate) fn book_routes() -> Router<ApiManager> {
    Router::new()
        .route("/book", post(create_book))
        .route("/book", get(get_book))
        .route("/book/all", get(get_existing_books))
        .route("/book/initialize", patch(initialize_book))
        .route("/book/filters", get(get_filters))
        .route("/book/filters", patch(update_filter))
}

async fn create_book(
    State(api_manager) : State<ApiManager>,
    Json(book_to_create): Json<BookCreationParams>
) -> impl IntoResponse {
    let pool_cloned = api_manager.pool.clone();
    let mut tx = pool_cloned.begin().await.unwrap();
    sqlx::query(
        r#"
            INSERT INTO books 
            (id, name, directory)
            VALUES($1, $2, $3);
        "#)
        .bind(book_to_create.id)
        .bind(book_to_create.name)
        .bind(book_to_create.directory)
        .execute(&mut *tx)
        .await
        .unwrap();
    for element in book_to_create.elements {
        sqlx::query(
            r#"
                INSERT INTO elements
                (id, name, element, enabled, book_id)
                VALUES($1, $2, $3, $4, $5);
            "#)
            .bind(element.id)
            .bind(element.name)
            .bind(element.element)
            .bind(element.enabled)
            .bind(element.book_id)
            .execute(&mut *tx)
            .await
            .unwrap();
    }
    // tx.commit().await.unwrap();
    for filter in book_to_create.filters {
        match sqlx::query(
            r#"
                INSERT INTO wizforms_filters
                (id, book_id, filter_type, name, enabled)
                VALUES($1, $2, $3, $4, $5);
            "#)
            .bind(filter.id)
            .bind(filter.book_id)
            .bind(filter.filter_type)
            .bind(filter.name)
            .bind(filter.enabled)
            .execute(&mut *tx)
            .await 
        {
            Ok(success) => {
                tracing::info!("Filter inserted");
            },
            Err(failure) => {
                tracing::info!("Filter insert error: {}", failure.to_string());
            }
        };
    }
    tx.commit().await.unwrap();
    (StatusCode::OK, "Ok".to_string())
}


async fn get_book(
    State(api_manager) : State<ApiManager>,
    Json(book_id): Json<StringPayload>
) -> Result<Json<Book>, String> {
    let res: Result<Book, sqlx::Error> = sqlx::query_as("SELECT * FROM books WHERE id=$1;")
        .bind(&book_id.value)
        .fetch_one(&api_manager.pool)
        .await;
    match res {
        Ok(b) => {
            Ok(Json(b))
        },
        Err(e) => {
            Err(format!("Error trying to get book with id {}: {}", &book_id.value, e.to_string()))
        }
    } 
}

async fn get_existing_books(
    State(api_manager) : State<ApiManager>
) -> Result<Json<Vec<Book>>, String> {
    let res: Result<Vec<Book>, sqlx::Error> = sqlx::query_as("SELECT * FROM books;")
        .fetch_all(&api_manager.pool)
        .await;
    match res {
        Ok(b) => {
            tracing::info!("Got books from db: {:?}", &b);
            Ok(Json(b))
        },
        Err(e) => {
            tracing::info!("Error trying to get all books {}", &e.to_string());
            Err(format!("Error trying to get all books {}", e.to_string()))
        }
    } 
}

async fn initialize_book(
    State(api_manager): State<ApiManager>,
    Json(book_id): Json<StringOptionPayload>
) -> Result<String, String> {
    tracing::info!("Got payload: {:?}", &book_id);
    let update_res: Result<Book, _> = sqlx::query_as("UPDATE books SET initialized=true WHERE id=$1 RETURNING *;")
        .bind(&book_id.value.as_ref().unwrap())
        .fetch_one(&api_manager.pool)
        .await;
    match update_res {
        Ok(_success) => {
            Ok(format!("Book {} updated ok", &book_id.value.as_ref().unwrap()))
        },
        Err(e) => {
            Err(format!("Error quering book update: {}: {}", &book_id.value.as_ref().unwrap(), e.to_string()))
        }
    }
}

async fn get_filters(
    State(api_manager): State<ApiManager>,
    Json(book_id): Json<StringOptionPayload>
) -> Result<Json<Vec<WizformFilterDBModel>>, ()> {
    let res: Result<Vec<WizformFilterDBModel>, sqlx::Error> = sqlx::query_as("SELECT * FROM wizforms_filters WHERE book_id=$1;")
        .bind(book_id.value)
        .fetch_all(&api_manager.pool)
        .await;
    match res {
        Ok(success) => {
            Ok(Json(success))
        },
        Err(failure) => {
            tracing::info!("Error fetching wizforms filters: {}", failure.to_string());
            Err(())
        }
    }
}

async fn update_filter(
    State(api_manager) : State<ApiManager>,
    Json(filter): Json<WizformFilterDBModel>
) -> impl IntoResponse {
    let res: Result<WizformFilterDBModel, sqlx::Error> = sqlx::query_as(r#"
            UPDATE wizforms_filters SET name=$1, enabled=$2
            WHERE book_id=$3 AND filter_type=$4
            RETURNING *; 
        "#)
        .bind(filter.name)
        .bind(filter.enabled)
        .bind(filter.book_id)
        .bind(filter.filter_type)
        .fetch_one(&api_manager.pool)
        .await;
    match res {
        Ok(success) => {
            tracing::info!("filter updated successfully");
            Ok(())
        },
        Err(failure) => {
            tracing::info!("error updating filter: {}", failure.to_string());
            Err(())
        }
    }
}