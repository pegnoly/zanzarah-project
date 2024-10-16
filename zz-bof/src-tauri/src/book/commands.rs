use std::{collections::HashMap, io::Write};
use tauri::{AppHandle, Manager, State};
use uuid::Uuid;
use zz_data::{book::base::BookDBModel, core::wizform::{ElementDBModel, WizformDBModel}};

use super::{source::{create_local_db, setup_local_db, try_load_books, try_load_wizforms}, utils::{ElementFrontendModel, LocalAppManager, WizformLocalDBModel, WizformMobileFrontendModel, WizformMobileFrontendSimpleModel}};

pub(crate) const MAIN_URL: &'static str = "https://zz-webapi-cv7m.shuttle.app";

#[tauri::command]
pub async fn load_app(
    app_manager: State<'_, LocalAppManager>,
    app: AppHandle
) -> Result<Vec<BookDBModel>, ()> {
    let mut app_data_path = app_manager.app_data_path.write().await;
    *app_data_path = Some(app.path().data_dir().unwrap());
    let data_path_reader = app_data_path.downgrade();
    //
    // let local_db_path = data_path_reader.as_ref().unwrap().join("local_books_data.db");
    // create_local_db(&app_manager, local_db_path).await;
    // setup_local_db(&app_manager).await;

    let client = app_manager.client.read().await;
    let response = client.get(format!("{}/book/all", MAIN_URL))
        .send()
        .await;
    match response {
        Ok(success) => {
            let json: Result<Vec<BookDBModel>, reqwest::Error> = success.json().await;
            match json {
                Ok(books) => {
                    Ok(books)
                },
                Err(json_error) => {
                    println!("Error parsing existing books json: {}", json_error.to_string());
                    Err(())
                }
            }
        },
        Err(failure) => {
            println!("Failed to load existing books: {}", failure.to_string());
            Err(())
        }
    }
}


#[tauri::command]
pub async fn load_wizforms(
    book_id: Uuid,
    app_manager: State<'_, LocalAppManager>
) -> Result<Vec<WizformMobileFrontendSimpleModel>, ()> {

    let client = app_manager.client.read().await;
    let response = client.get(format!("{}/wizforms/{}", MAIN_URL, &book_id))
        .send()
        .await;
    match response {
        Ok(success) => {
            let json: Result<Vec<WizformDBModel>, reqwest::Error> = success.json().await;
            match json {
                Ok(wizforms) => {
                    Ok(wizforms.into_iter()
                        //.filter(|w| w.enabled )
                        .map(|w| {
                        WizformMobileFrontendSimpleModel::from(w)
                    }).collect())
                },
                Err(json_error) => {
                    println!("Error parsing enabled wizforms json: {}", json_error.to_string());
                    Err(())
                }
            }
        },
        Err(failure) => {
            println!("Error to fetch enabled wizforms for book {}: {}", book_id, failure.to_string());
            Err(())
        }
    }
    // let pool_read_locked = app_manager.local_pool.read().await;
    // let pool = pool_read_locked.as_ref().unwrap();
    // let existing_wizforms_result: Result<Vec<WizformLocalDBModel>, sqlx::Error> = sqlx::query_as(r#"
    //         SELECT * FROM wizforms WHERE book_id=?;
    //     "#)
    //     .bind(&book_id)
    //     .fetch_all(pool)
    //     .await;
    // match existing_wizforms_result {
    //     Ok(existing_wizforms) => {
    //         if existing_wizforms.len() > 0 {
    //             Ok(existing_wizforms.iter().map(|w| {
    //                 WizformMobileFrontendModel::from(w)
    //             }).collect())
    //         }
    //         else {
    //             let frontend_wizforms = try_load_wizforms(&app_manager, &book_id).await;
    //             match frontend_wizforms {
    //                 Ok(wizforms) => {
    //                     Ok(wizforms)
    //                 },
    //                 Err(_e) => {
    //                     println!("Failed to get wizforms");
    //                     Err(())
    //                 }
    //             }
    //         }
    //     },
    //     Err(e) => {
    //         println!("Error fetching existing wizforms from local db: {}", e.to_string());
    //         Err(())
    //     }
    // }
}

#[tauri::command]
pub async fn load_elements(
    book_id: Uuid,
    app_manager: State<'_, LocalAppManager>
) -> Result<Vec<ElementFrontendModel>, ()> {

    let client = app_manager.client.read().await;
    let response = client.get(format!("{}/elements/{}", MAIN_URL, &book_id))
        .send()
        .await;
    match response {
        Ok(success) => {
            let json: Result<Vec<ElementDBModel>, reqwest::Error> = success.json().await;
            match json {
                Ok(elements) => {
                    Ok(elements.into_iter()
                        .filter(|e| e.enabled == true)
                        .map(|e| {
                            ElementFrontendModel::from(e)
                        }).collect())
                },
                Err(json_error) => {
                    println!("Failed to parse elements json: {}", json_error.to_string());
                    Err(())
                }
            }
        },
        Err(failure) => {
            println!("Failed to fetch elements for book {}: {}", book_id, failure.to_string());
            Err(())
        }
    }

    // let pool_read_locked = app_manager.local_pool.read().await;
    // let pool = pool_read_locked.as_ref().unwrap();

    // let existing_elements_result: Result<Vec<WizformElementModel>, sqlx::Error> = sqlx::query_as(r#"
    //         SELECT * FROM elements WHERE book_id=?;
    //     "#)
    //     .bind(&book_id)
    //     .fetch_all(pool)
    //     .await;
    // match existing_elements_result {
    //     Ok(elements) => {
    //         if elements.len() > 0 {
    //             Ok(elements.into_iter()
    //             .filter(|e| {
    //                 e.enabled
    //             })
    //             .map(|e| {
    //                 WizformElementFrontendModel {
    //                     id: e.id,
    //                     element: e.element as i32,
    //                     name: e.name,
    //                     enabled: e.enabled
    //                 }
    //             })
    //             .collect())
    //         }
    //         else {
    //             let client = app_manager.client.read().await;
    //             let response = client.get("https://zz-webapi.shuttleapp.rs/elements")
    //                 .json(&HashMap::from([("value", &book_id)]))
    //                 .send()
    //                 .await;

    //             match response {
    //                 Ok(response_ok) => {
    //                     let json: Result<Vec<WizformElementModel>, reqwest::Error> = response_ok.json().await;
    //                     match json {
    //                         Ok(elements) => {

    //                             let mut transaction = pool.begin().await.unwrap();
    //                             for element in elements.iter() {
    //                                 sqlx::query(r#"
    //                                     INSERT INTO elements
    //                                     (id, book_id, element, name, enabled)
    //                                     VALUES (?, ?, ?, ?, ?);
    //                                 "#)
    //                                 .bind(&element.id)
    //                                 .bind(&element.book_id)
    //                                 .bind(element.element.clone() as i32)
    //                                 .bind(&element.name)
    //                                 .bind(element.enabled)
    //                                 .execute(&mut *transaction)
    //                                 .await
    //                                 .unwrap();
    //                             }

    //                             transaction.commit().await.unwrap();

    //                             Ok(elements.into_iter()
    //                                     .filter(|e| {e.enabled})
    //                                     .map(|e| {
    //                                         WizformElementFrontendModel {
    //                                             id: e.id.clone(),
    //                                             element: e.element.clone() as i32,
    //                                             name: e.name.clone(),
    //                                             enabled: e.enabled
    //                                         }
    //                                     })
    //                                     .collect())
    //                         },
    //                         Err(e) => {
    //                             println!("Failed to parse elements json: {}", e.to_string());
    //                             Err(())
    //                         }
    //                     }
    //                 },
    //                 Err(response_error) => {
    //                     println!("Failed to fetch existing elements from api: {}", response_error.to_string());
    //                     Err(())
    //                 }
    //             }
    //         }
    //     },
    //     Err(e) => {
    //         println!("Error fetching existing elements from local db: {}", e.to_string());
    //         Err(())
    //     }
    // }
}

// #[tauri::command]
// pub async fn load_filters(
//     book_id: String,
//     app: AppHandle,
//     app_manager: State<'_, LocalAppManager>
// ) -> Result<Vec<WizformFilterDBModel>, ()> {
//     let book_data_path = app.path().data_dir().unwrap().join(format!("{}\\", &book_id));
//     let filters_data_path = book_data_path.join("filters.json");
//     if filters_data_path.exists() {
//         println!("Reading filters from json file");
//         let filters: Result<Vec<WizformFilterDBModel>, serde_json::Error> = serde_json::from_str(&std::fs::read_to_string(&filters_data_path).unwrap());
//         Ok(filters.unwrap())
//     }
//     else {
//         let client = app_manager.client.read().await;
//         let response = client.get("https://zz-webapi.shuttleapp.rs/book/filters")
//             .json(&HashMap::from([("value", &book_id)]))
//             .send()
//             .await;
//         match response {
//             Ok(response_ok) => {
//                 let json: Result<Vec<WizformFilterDBModel>, reqwest::Error> = response_ok.json().await;
//                 match json {
//                     Ok(filters) => {
//                         if book_data_path.exists() == false {
//                             std::fs::create_dir(book_data_path).unwrap();
//                         }
//                         let mut file = std::fs::File::create(&filters_data_path).unwrap();
//                         let s = serde_json::to_string_pretty(&filters).unwrap();
//                         file.write_all(&mut s.as_bytes()).unwrap();
//                         Ok(filters)
//                     },
//                     Err(e) => {
//                         println!("Failed to parse filters json: {}", e.to_string());
//                         Err(())
//                     }
//                 }
//             },
//             Err(e) => {
//                 println!("Failed to fetch filters: {}", e.to_string());
//                 Err(())
//             }
//         }
//     }
// }

#[tauri::command]
pub async fn load_wizform(
    id: Uuid,
    app_manager: State<'_, LocalAppManager>
) -> Result<WizformMobileFrontendModel, ()> {
    let client = app_manager.client.read().await;
    let response = client.get(format!("{}/wizform/{}", MAIN_URL, &id))
        .send()
        .await;
    match response {
        Ok(success) => {
            let json: Result<WizformDBModel, reqwest::Error> = success.json().await;
            match json {
                Ok(wizform) => {
                    Ok(WizformMobileFrontendModel::from(wizform))
                },
                Err(json_error) => {
                    println!("Failed to parse wizform {} json: {}", &id, json_error.to_string());
                    Err(())
                }
            }
        },
        Err(failure) => {
            println!("Failed to fetch wizform {} data: {}", &id, failure.to_string());
            Err(())
        }
    }
}