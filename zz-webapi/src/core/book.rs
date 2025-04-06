use std::collections::HashMap;

use axum::{extract::{DefaultBodyLimit, Path, Query, State}, http::StatusCode, response::IntoResponse, routing::{delete, get, patch, post}, Json, Router};
use strum::IntoEnumIterator;
use uuid::Uuid;
use zz_data::{book::base::BookDBModel, core::wizform::{ElementDBModel, WizformElementType}};

use super::{queries::BookCreationQuery, utils::{ApiManager, StringOptionPayload, StringPayload}};

pub(crate) fn book_routes() -> Router<ApiManager> {
    Router::new()
        .route("/book/create", post(create_book))
        .route("/book/{book_id}", get(get_book))
        .route("/book/all", get(get_existing_books))
        .route("/book/initialize/{book_id}", patch(initialize_book))
        // .route("/book/filters", get(get_filters))
        // .route("/book/filters", patch(update_filter))
        // .route("/book/points/:book_id", get(get_spawn_points))
        // .route("/book/point", post(create_spawn_point))
        // .route("/book/point/remove/:point_id", delete(remove_spawn_point))
}

/// Writes book with given id, name and directory into db. Also default set of elements will be written for this book.
async fn create_book(
    State(api_manager) : State<ApiManager>,
    Query(book_creation_query) : Query<BookCreationQuery>
) -> impl IntoResponse {
    let pool_cloned = api_manager.pool.clone();
    let mut tx = pool_cloned.begin().await.unwrap();
    sqlx::query(
        r#"
            INSERT INTO books 
            (id, name, directory)
            VALUES($1, $2, $3);
        "#)
        .bind(&book_creation_query.id)
        .bind(&book_creation_query.name)
        .bind(&book_creation_query.directory)
        .execute(&mut *tx)
        .await
        .unwrap();
    
    let element_models = WizformElementType::iter()
        .map(|element| {
            ElementDBModel {
                id: Uuid::new_v4(),
                book_id: book_creation_query.id,
                element: element.clone(),
                name: element.to_string(),
                enabled: !matches!(element, WizformElementType::Custom1 | WizformElementType::Custom2 | 
                    WizformElementType::Custom3 | WizformElementType::Custom4 |
                    WizformElementType::Custom5)
            }
        })
        .collect::<Vec<ElementDBModel>>();
        
    for element_model in element_models {
        sqlx::query(
        r#"
                INSERT INTO elements
                (id, name, element, enabled, book_id)
                VALUES($1, $2, $3, $4, $5);
            "#
        )
        .bind(element_model.id)
        .bind(element_model.name)
        .bind(element_model.element)
        .bind(element_model.enabled)
        .bind(&book_creation_query.id)
        .execute(&mut *tx)
        .await
        .unwrap();
    }
    tx.commit().await.unwrap();
    StatusCode::CREATED
}


async fn get_book(
    State(api_manager) : State<ApiManager>,
    Path(id): Path<Uuid>
) -> Result<Json<BookDBModel>, ()> {
    let res: Result<BookDBModel, sqlx::Error> = sqlx::query_as("SELECT * FROM books WHERE id=$1;")
        .bind(&id)
        .fetch_one(&api_manager.pool)
        .await;
    match res {
        Ok(book) => {
            Ok(Json(book))
        },
        Err(failure) => {
            tracing::error!("Failed to get book with id {}: {}", &id, failure.to_string());
            Err(())
        }
    } 
}


async fn get_existing_books(
    State(api_manager) : State<ApiManager>
) -> Result<Json<Vec<BookDBModel>>, String> {
    let res: Result<Vec<BookDBModel>, sqlx::Error> = sqlx::query_as("SELECT * FROM books WHERE initialized=true AND downloadable=true;")
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
    Path(book_id): Path<Uuid>
) -> Result<(), ()> {
    //tracing::info!("Got payload: {:?}", &book_id);
    let update_res: Result<BookDBModel, _> = sqlx::query_as("UPDATE books SET initialized=true WHERE id=$1 RETURNING *;")
        .bind(&book_id)
        .fetch_one(&api_manager.pool)
        .await;
    match update_res {
        Ok(_success) => {
            Ok(())
        },
        Err(e) => {
            Err(())
        }
    }
}

// async fn get_filters(
//     State(api_manager): State<ApiManager>,
//     Json(book_id): Json<StringOptionPayload>
// ) -> Result<Json<Vec<WizformFilterDBModel>>, ()> {
//     let res: Result<Vec<WizformFilterDBModel>, sqlx::Error> = sqlx::query_as("SELECT * FROM wizforms_filters WHERE book_id=$1;")
//         .bind(book_id.value)
//         .fetch_all(&api_manager.pool)
//         .await;
//     match res {
//         Ok(success) => {
//             Ok(Json(success))
//         },
//         Err(failure) => {
//             tracing::info!("Error fetching wizforms filters: {}", failure.to_string());
//             Err(())
//         }
//     }
// }

// async fn update_filter(
//     State(api_manager) : State<ApiManager>,
//     Json(filter): Json<WizformFilterDBModel>
// ) -> impl IntoResponse {
//     let res: Result<WizformFilterDBModel, sqlx::Error> = sqlx::query_as(r#"
//             UPDATE wizforms_filters SET name=$1, enabled=$2
//             WHERE book_id=$3 AND filter_type=$4
//             RETURNING *; 
//         "#)
//         .bind(filter.name)
//         .bind(filter.enabled)
//         .bind(filter.book_id)
//         .bind(filter.filter_type)
//         .fetch_one(&api_manager.pool)
//         .await;
//     match res {
//         Ok(success) => {
//             tracing::info!("filter updated successfully");
//             Ok(())
//         },
//         Err(failure) => {
//             tracing::info!("error updating filter: {}", failure.to_string());
//             Err(())
//         }
//     }
// }

// async fn create_spawn_point(
//     State(api_manager): State<ApiManager>,
//     Json(spawn_point): Json<WizformSpawnPoint>
// ) -> Result<(), ()> {
//     let res = sqlx::query("INSERT INTO spawn_points (id, book_id, name) VALUES($1, $2, $3)")
//         .bind(spawn_point.id)
//         .bind(spawn_point.book_id)
//         .bind(spawn_point.name)
//         .execute(&api_manager.pool)
//         .await;
//     match res {
//         Ok(_success) => {
//             tracing::info!("Spawn point inserted correctly");
//             Ok(())
//         },
//         Err(failure) => {
//             tracing::info!("Failed to insert spawn point: {}", failure.to_string());
//             Err(()) 
//         }
//     }
// }

// async fn remove_spawn_point(
//     State(api_manager) : State<ApiManager>,
//     Path(point_id): Path<String>
// ) -> impl IntoResponse {
//     let res = sqlx::query("DELETE FROM spawn_points WHERE id=$1;")
//         .bind(point_id)
//         .execute(&api_manager.pool)
//         .await;
//     match res {
//         Ok(_success) => {
//             tracing::info!("Spawn point deleted correctly");
//             Ok(())
//         },
//         Err(failure) => {
//             tracing::info!("Failed to delete spawn point: {}", failure.to_string());
//             Err(()) 
//         }
//     }
// }

// async fn get_spawn_points(
//     State(api_manager) : State<ApiManager>,
//     Path(book_id): Path<String>
// ) -> Result<Json<Vec<WizformSpawnPoint>>, ()> {
//     let res: Result<Vec<WizformSpawnPoint>, sqlx::Error> = sqlx::query_as("SELECT * FROM spawn_points WHERE book_id=$1;")
//         .bind(book_id)
//         .fetch_all(&api_manager.pool)
//         .await;
//     match res {
//         Ok(success) => {
//             tracing::info!("Spawn points selected correctly");
//             Ok(Json(success))
//         },
//         Err(failure) => {
//             tracing::info!("Failed to fetch spawn points: {}", failure.to_string());
//             Err(()) 
//         }
//     }
// }