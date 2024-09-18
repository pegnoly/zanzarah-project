use axum::{extract::State, routing::{get, patch}, Json, Router};
use zz_data::core::wizform::{WizformElementFrontendModel, WizformElementModel};

use super::utils::{ApiManager, StringPayload};

pub(crate) fn elements_routes() -> Router<ApiManager> {
    Router::new()
        .route("/elements", get(get_existing_elements))
        .route("/element", patch(update_element))
}

async fn get_existing_elements(
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
            //tracing::info!("Got wizforms: {:?}", &query_success);
            Ok(Json(query_success))
        }
        Err(query_failure) => {
            tracing::info!("Error fetching elements of book {}: {}", &book_id.value, query_failure.to_string());
            Err(format!("Error fetching elements of book {}: {}", &book_id.value, query_failure.to_string()))
        }
    }
}

async fn update_element(
    State(api_manager) : State<ApiManager>,
    Json(element) : Json<WizformElementFrontendModel> 
) -> Result<String, String> {
    tracing::info!("Got json for updating element {:?}", &element);
    let res: Result<WizformElementModel, sqlx::Error> = sqlx::query_as(r#"
            UPDATE elements 
            SET name=$1, enabled=$2
            WHERE id=$3
            RETURNING *;
        "#)
        .bind(&element.name)
        .bind(&element.enabled)
        .bind(&element.id)
        .fetch_one(&api_manager.pool)
        .await;
    match res {
        Ok(r) => {
            tracing::info!("Element {:?} updated successfully", &r);
            Ok(format!("Element {} updated successfully", element.name))
        },
        Err(e) => {
            tracing::info!("Failed updating element {}", &element.name);
            Err(format!("Failed updating element {}: {}", element.name, e.to_string()))
        }
    }
}