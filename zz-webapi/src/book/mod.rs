use axum::{
    extract::State, 
    http::StatusCode, 
    response::IntoResponse, 
    Json
};

use serde::{Deserialize, Serialize};
use zz_data::{
    book::{self, base::{
        Book,
        BookCreationParams
    }}, 
    core::wizform::{
        WizformDBModel, 
        WizformElementModel
    }
};

use crate::ApiManager;

pub mod routes;
mod source;

pub async fn create_book(
    State(api_manager) : State<ApiManager>,
    Json(book_to_create): Json<BookCreationParams>
) -> impl IntoResponse {
    let pool_cloned = api_manager.pool.clone();
    //tokio::task::spawn(async move {
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
    tx.commit().await.unwrap();  
    //});
    (StatusCode::OK, "Ok".to_string())
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StringPayload {
    pub value: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StringOptionPayload {
    pub value: Option<String>
}

pub async fn get_book(
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

pub async fn initialize_book(
    State(api_manager): State<ApiManager>,
    Json(book_id): Json<StringOptionPayload>
) -> Result<String, String> {
    tracing::info!("Got payload: {:?}", &book_id);
    //let sql = format!("UPDATE books SET initialized=true WHERE id='{}' RETURNING *;", &book_id.value.as_ref().unwrap());
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

pub async fn get_existing_wizforms(
    State(api_manager) : State<ApiManager>,
    Json(book_id): Json<StringPayload>
) -> Result<Json<Vec<WizformDBModel>>, String> {
    let wizforms_res: Result<Vec<WizformDBModel>, sqlx::Error> = sqlx::query_as(r#"
            SELECT * FROM wizforms WHERE book_id=$1;
        "#)
        .bind(&book_id.value)
        .fetch_all(&api_manager.pool)
        .await;
    match wizforms_res {
        Ok(wizforms) => {
            Ok(Json(wizforms))
        },
        Err(e) => {
            Err(format!("Error fetching wizforms from book with id {}: {}", &book_id.value, &e.to_string()))
        }
    }
}

pub async fn load_all_wizforms(
    State(api_manager) : State<ApiManager>,
    Json(wizforms): Json<Vec<WizformDBModel>>
) -> Result<(), String> {
    let mut tx = api_manager.pool.begin().await.unwrap();
    for wizform in wizforms {
        let res = sqlx::query(r#"
            INSERT INTO wizforms 
            (id, book_id, game_id, name, element, magics, number, hitpoints, agility, jump_ability, precision, evolution_form, evolution_level, exp_modifier)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
            "#)
            .bind(wizform.id)
            .bind(wizform.book_id)
            .bind(wizform.game_id)
            .bind(&wizform.name)
            .bind(wizform.element)
            .bind(wizform.magics)
            .bind(wizform.number)
            .bind(wizform.hitpoints)
            .bind(wizform.agility)
            .bind(wizform.jump_ability)
            .bind(wizform.precision)
            .bind(wizform.evolution_form)
            .bind(wizform.evolution_level)
            .bind(wizform.exp_modifier)
            .execute(&mut *tx)
            .await;
        match res {
            Ok(r) => {},
            Err(e) => {
                return Err(format!("Smth happen while inserting wizform {}: {}", &wizform.name, e.to_string()));
            }
        }
    }
    let commit_res = tx.commit().await;
    match commit_res {
        Ok(r) => {
            Ok(())
        },
        Err(e) => {
            Err(format!("Smth happen while inserting wizforms: {}", e.to_string()))
        }
    }
}

pub async fn get_existing_elements(
    State(api_manager) : State<ApiManager>,
    Json(book_id): Json<StringPayload>
) -> Result<Json<Vec<WizformElementModel>>, String> {
    tracing::info!("elements fetching id: {}", &book_id.value);
    let res: Result<Vec<WizformElementModel>, sqlx::Error> = sqlx::query_as(r#"
            SELECT * FROM elements WHERE book_id=$1;
        "#)
        .bind(&book_id.value)
        .fetch_all(&api_manager.pool)
        .await;
    match res {
        Ok(query_success) => {
            tracing::info!("Got wizforms: {:?}", &query_success);
            Ok(Json(query_success))
        }
        Err(query_failure) => {
            tracing::info!("Error fetching elements of book {}: {}", &book_id.value, query_failure.to_string());
            Err(format!("Error fetching elements of book {}: {}", &book_id.value, query_failure.to_string()))
        }
    }
}