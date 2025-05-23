use axum::{
    Json, Router,
    extract::{Path, Query, State},
    routing::{get, patch},
};
use uuid::Uuid;
use zz_data::core::wizform::ElementDBModel;

use super::{
    queries::ElementUpdateQuery,
    utils::{ApiManager, StringPayload},
};

pub(crate) fn elements_routes() -> Router<ApiManager> {
    Router::new()
        .route("/elements/{book_id}", get(get_existing_elements))
        .route("/element", patch(update_element))
}

async fn get_existing_elements(
    State(api_manager): State<ApiManager>,
    Path(book_id): Path<Uuid>,
) -> Result<Json<Vec<ElementDBModel>>, ()> {
    let res: Result<Vec<ElementDBModel>, sqlx::Error> = sqlx::query_as(
        r#"
            SELECT * FROM elements WHERE book_id=$1;
        "#,
    )
    .bind(&book_id)
    .fetch_all(&api_manager.pool)
    .await;
    match res {
        Ok(query_success) => {
            //tracing::info!("Got wizforms: {:?}", &query_success);
            Ok(Json(query_success))
        }
        Err(query_failure) => {
            tracing::info!(
                "Error fetching elements of book {}: {}",
                &book_id,
                query_failure.to_string()
            );
            Err(())
        }
    }
}

async fn update_element(
    State(api_manager): State<ApiManager>,
    Query(update_element_query): Query<ElementUpdateQuery>,
) -> Result<(), ()> {
    let res: Result<ElementDBModel, sqlx::Error> = sqlx::query_as(
        r#"
            UPDATE elements 
            SET name=$1, enabled=$2
            WHERE id=$3
            RETURNING *;
        "#,
    )
    .bind(&update_element_query.name)
    .bind(&update_element_query.enabled)
    .bind(&update_element_query.id)
    .fetch_one(&api_manager.pool)
    .await;
    match res {
        Ok(r) => {
            tracing::info!(
                "Element {:?} updated successfully",
                &update_element_query.name
            );
            Ok(())
        }
        Err(e) => {
            tracing::info!(
                "Failed updating element {}: {}",
                &update_element_query.name,
                e.to_string()
            );
            Err(())
        }
    }
}
