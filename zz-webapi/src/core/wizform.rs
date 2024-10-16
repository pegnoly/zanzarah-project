use axum::{extract::{DefaultBodyLimit, Path, Query, State}, routing::{get, patch, post}, Json, Router};
use uuid::Uuid;
use zz_data::core::wizform::WizformDBModel;

use super::{queries::WizformUpdateQuery, utils::{ApiManager, StringPayload}};

pub(crate) fn wizform_routes() -> Router<ApiManager> {
    Router::new()
        .route("/wizforms/:book_id", get(get_existing_wizforms))
        .route("/wizforms", post(save_wizforms))
        //.route("/wizforms", patch(update_wizforms))
        .route("/wizforms/enabled/:book_id", get(get_enabled_wizforms))
        .route("/wizform/:id", get(load_wizform))
        .route("/wizform/:id/update", patch(update_wizform))
        //.route("/wizform", patch(update_wizform))
        //.route("/wizform/:id/:name", patch(update_wizform_name))
        .layer(DefaultBodyLimit::max(10_000_000))
}

async fn save_wizforms(
    State(api_manager) : State<ApiManager>,
    Json(wizforms): Json<Vec<WizformDBModel>>
) -> Result<(), ()> {
    let mut tx = api_manager.pool.begin().await.unwrap();
    for wizform in wizforms {
        let res = sqlx::query(r#"
            INSERT INTO wizforms 
            (id, book_id, game_id, name, description, icon64,
            element, magics, number, 
            hitpoints, agility, jump_ability, precision, 
            evolution_form, evolution_level, exp_modifier, 
            enabled, 
            filters, spawn_points)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
            ON CONFLICT(id) DO UPDATE 
            SET name=$20, description=$21, element=$22, magics=$23, hitpoints=$24, agility=$25, jump_ability=$26, 
            precision=$27, evolution_form=$28, evolution_level=$29, exp_modifier=$30, enabled=$31;
            "#)
            .bind(wizform.id)
            .bind(wizform.book_id)
            .bind(wizform.game_id)
            .bind(&wizform.name)
            .bind(&wizform.description)
            .bind(&wizform.icon64)
            .bind(wizform.element.clone())
            .bind(&wizform.magics)
            .bind(wizform.number)
            .bind(wizform.hitpoints)
            .bind(wizform.agility)
            .bind(wizform.jump_ability)
            .bind(wizform.precision)
            .bind(wizform.evolution_form)
            .bind(wizform.evolution_level)
            .bind(wizform.exp_modifier)
            .bind(wizform.enabled)
            .bind(wizform.filters)
            .bind(wizform.spawn_points)
            .bind(&wizform.name)
            .bind(&wizform.description)
            .bind(wizform.element)
            .bind(&wizform.magics)
            .bind(wizform.hitpoints)
            .bind(wizform.agility)
            .bind(wizform.jump_ability)
            .bind(wizform.precision)
            .bind(wizform.evolution_form)
            .bind(wizform.evolution_level)
            .bind(wizform.exp_modifier)
            .bind(wizform.enabled)
            .execute(&mut *tx)
            .await;
        match res {
            Ok(_r) => {},
            Err(e) => {
                tracing::info!("Smth happen while inserting wizform {}: {}", &wizform.number, e.to_string());
            }
        }
    }
    let commit_res = tx.commit().await;
    match commit_res {
        Ok(_r) => {
            Ok(())
        },
        Err(e) => {
            tracing::info!("Smth happen while inserting wizforms: {}", e.to_string());
            Err(())
        }
    }
}

async fn get_existing_wizforms(
    State(api_manager) : State<ApiManager>,
    Path(book_id): Path<Uuid> 
) -> Result<Json<Vec<WizformDBModel>>, ()> {
    let wizforms_res: Result<Vec<WizformDBModel>, sqlx::Error> = sqlx::query_as(r#"
            SELECT * FROM wizforms WHERE book_id=$1;
        "#)
        .bind(&book_id)
        .fetch_all(&api_manager.pool)
        .await;
    match wizforms_res {
        Ok(wizforms) => {
            Ok(Json(wizforms))
        },
        Err(e) => {
            tracing::info!("Error fetching wizforms from book with id {}: {}", &book_id, &e.to_string());
            Err(())
        }
    }
}

async fn load_wizform(
    State(api_manager) : State<ApiManager>,
    Path(id): Path<Uuid>
) -> Result<Json<WizformDBModel>, ()> {
    let res: Result<WizformDBModel, sqlx::Error> = sqlx::query_as("SELECT * FROM wizforms WHERE id=$1")
        .bind(&id)
        .fetch_one(&api_manager.pool)
        .await;
    match res {
        Ok(success) => {
            tracing::info!("Wizform {} successfully fetched", &success.number);
            Ok(Json(success))
        },
        Err(failure) => {
            tracing::info!("Failed to fetch wizform {}: {}", &id, failure.to_string());
            Err(())
        }
    }
}

async fn update_wizform(
    State(api_manager) : State<ApiManager>,
    Path(id): Path<Uuid>,
    Query(wizform_update_query): Query<WizformUpdateQuery>
) -> Result<(), ()> {
    let current_res: Result<WizformDBModel, sqlx::Error> = sqlx::query_as("SELECT * FROM wizforms WHERE id=$1")
        .bind(&id)
        .fetch_one(&api_manager.pool)
        .await;
    match current_res {
        Ok(wizform) => {
            let res: Result<WizformDBModel, sqlx::Error> = sqlx::query_as(
            r#"
                    UPDATE wizforms 
                    SET element = COALESCE($1, $2), 
                    enabled = COALESCE($3, $4)
                    WHERE id=$5
                    RETURNING *;
                "#)
                .bind(&wizform_update_query.element)
                .bind(&wizform.element)
                .bind(&wizform_update_query.enabled)
                .bind(&wizform.enabled)
                .bind(&id)
                .fetch_one(&api_manager.pool)
                .await;
            match res {
                Ok(success) => {
                    tracing::info!("Wizform {} updated successfully", success.number);
                    Ok(())
                },
                Err(failure) => {
                    tracing::error!("Failed to update wizform {}: {}", &id, failure.to_string());
                    Err(())
                }
            }
        },
        Err(wizform_failure) => {
            tracing::error!("Failed to fetch current wizform state {}: {}", &id, wizform_failure.to_string());
            Err(())
        }
    }
}

// async fn update_wizform(
//     State(api_manager) : State<ApiManager>,
//     Json(wizform) : Json<WizformFrontendModel> 
// ) -> Result<String, String> {
//     let res: Result<WizformDBModel, sqlx::Error> = sqlx::query_as(r#"
//             UPDATE wizforms 
//             SET name=$1, description=$2, element=$3, enabled=$4, filters=$5, spawn_points=$6
//             WHERE id=$7
//             RETURNING *;
//         "#)
//         .bind(&wizform.name)
//         .bind(&wizform.desc)
//         .bind(&wizform.element)
//         .bind(&wizform.enabled)
//         .bind(&wizform.filters)
//         .bind(&wizform.spawn_points)
//         .bind(&wizform.id)
//         .fetch_one(&api_manager.pool)
//         .await;
//     match res {
//         Ok(_) => {
//             tracing::info!("Wizform {} updated successfully", &wizform.number);
//             Ok(format!("Wizform {} updated successfully", wizform.number))
//         },
//         Err(e) => {
//             tracing::info!("Failed updating wizform {}", &wizform.number);
//             Err(format!("Failed updating wizform {}: {}", wizform.number, e.to_string()))
//         }
//     }
// }



// async fn update_wizform_name(
//     State(api_manager) : State<ApiManager>,
//     Query(query) : Query<WizformNameQuery>
// ) -> Result<(), ()> {
//     let res: Result<WizformDBModel, sqlx::Error> = sqlx::query_as(
//     r#"
//             UPDATE wizforms 
//             SET name=$1
//             WHERE id=$2
//             RETURNING *;
//         "#)
//         .bind(&query.name)
//         .bind(&query.id)
//         .fetch_one(&api_manager.pool)
//         .await;

//     match res {
//         Ok(_success) => {
//             tracing::info!("Wizform name {} updated successfully", query.name);
//             Ok(())
//         },
//         Err(failure) => {
//             tracing::error!("Failed to update wizform name as {}: {}", query.name, failure.to_string());
//             Err(())
//         }
//     }
// }

// async fn update_wizform_desc(
//     State(api_manager) : State<ApiManager>,
//     Query(query) : Query<WizformDescQuery>
// ) -> Result<(), ()> {
//     let res: Result<WizformDBModel, sqlx::Error> = sqlx::query_as(
//     r#"
//             UPDATE wizforms 
//             SET description=$1
//             WHERE id=$2
//             RETURNING *;
//         "#)
//         .bind(&query.desc)
//         .bind(&query.id)
//         .fetch_one(&api_manager.pool)
//         .await;

//     match res {
//         Ok(_success) => {
//             tracing::info!("Wizform desc {} updated successfully", query.desc);
//             Ok(())
//         },
//         Err(failure) => {
//             tracing::error!("Failed to update wizform desc as {}: {}", query.desc, failure.to_string());
//             Err(())
//         }
//     }
// }

// async fn update_wizforms(
//     State(api_manager) : State<ApiManager>,
//     Json(wizforms): Json<Vec<WizformFrontendModel>>
// ) -> Result<(), ()> {
//     let mut tx = api_manager.pool.begin().await.unwrap();
//     for wizform in wizforms {
//         let res: Result<WizformDBModel, sqlx::Error> = sqlx::query_as(r#"
//                 UPDATE wizforms 
//                 SET name=$1, description=$2, element=$3, enabled=$4, filters=$5, spawn_points=$6
//                 WHERE id=$7
//                 RETURNING *;
//             "#)
//             .bind(&wizform.name)
//             .bind(&wizform.desc)
//             .bind(&wizform.element)
//             .bind(&wizform.enabled)
//             .bind(&wizform.filters)
//             .bind(&wizform.spawn_points)
//             .bind(&wizform.id)
//             .fetch_one(&mut *tx)
//             .await;
//         match res {
//             Ok(success) => {
//                 tracing::info!("Wizform was updated in transaction");
//             },
//             Err(failure) => {
//                 tracing::info!("Wizform update in transaction failed: {}", failure.to_string());
//             }
//         }
//     }
//     tx.commit().await.unwrap();
//     Ok(())
// }

async fn get_enabled_wizforms(
    State(api_manager) : State<ApiManager>,
    Path(book_id): Path<Uuid> 
) -> Result<Json<Vec<WizformDBModel>>, String> {
    let res: Result<Vec<WizformDBModel>, sqlx::Error> = sqlx::query_as("SELECT * FROM wizforms WHERE book_id=$1 AND enabled=true;")
        .bind(&book_id)
        .fetch_all(&api_manager.pool)
        .await;
    match res {
        Ok(res_ok) => {
            tracing::info!("Successfully got enabled wizforms of book {}", book_id);
            Ok(Json(res_ok))
        },
        Err(res_fail) => {
            tracing::info!("Failed to get existing wizforms of book {}: {}", &book_id, &res_fail.to_string());
            Err(format!("Failed to get existing wizforms of book {}: {}", book_id, res_fail.to_string()))
        }
    }
}

// async fn load_wizforms(
//     State(api_manager) : State<ApiManager>,
//     Path(book_id): Path<String>
// )