use std::{collections::HashMap, io::Write};

use base64::Engine;
use reqwest::{multipart, StatusCode};
use serde::{Deserialize, Serialize};
use strum::IntoEnumIterator;
use tauri::{AppHandle, Emitter, State};
use tauri_plugin_dialog::DialogExt;
use uuid::Uuid;
use zz_data::{
    book::base::BookDBModel,
    core::wizform::{
        ElementDBModel, WizformDBModel, WizformElementType
    }
};

pub(crate) const MAIN_URL: &'static str = "https://zz-webapi-cv7m.shuttle.app";

use crate::parser::utils::BookConfigSchema;

use super::{
    source::{
        parse_texts, 
        parse_wizforms,
        upload_wizform_chunk
    }, types::{ElementFrontendModel, WizformFrontendFullModel, WizformFrontendSimpleModel}, utils::AppManager
};

/// Executed on frontend startup, on success returns ids of locally stored books.
/// #
#[tauri::command]
pub async fn load_existing_books_info(
    app_manager: State<'_, AppManager>
) -> Result<Vec<Uuid>, ()> {
    let config_locked = app_manager.config.lock().await;
    Ok(vec![])
}

/// Executed on frontend startup, on success returns id of last edited book.
/// #
#[tauri::command]
pub async fn load_current_book_info(
    app_manager: State<'_, AppManager>
) -> Result<Uuid, ()> {
    let config_locked = app_manager.config.lock().await; 
    Ok(config_locked.as_ref().unwrap().current_book)
}

/// Executed when user tries to pick up directory in a process of new book creation.
/// #
#[tauri::command]
pub async fn try_pick_directory(
    app: AppHandle
) -> Result<(), ()> {
    app.dialog().file()
        .set_can_create_directories(false)
        .pick_folder(move |f| {
            match f {
                Some(folder) => {
                    app.emit("directory_picked", folder.to_string()).unwrap();
                },
                None => {}
            }
        }
    );
    Ok(())
}

/// Executed when user tries to create new book.  
/// 
/// # Arguments
/// 
/// * `name` - name of book  
/// * `directory` - directory of game files for this book 
/// 
/// # Additional
/// 
/// Creates both book and default elements for it.  
/// Adds id of created book into local config
/// #
#[tauri::command]
pub async fn try_create_book(
    name: String,
    directory: String,
    app_manager: State<'_, AppManager>
) -> Result<Uuid, ()> {
    let client = app_manager.client.read().await;
    let book_id = uuid::Uuid::new_v4();
    std::fs::create_dir_all(
        std::env::current_exe().unwrap().parent().unwrap().join(format!("{}\\", &book_id))
    ).unwrap();
    let mut config = app_manager.config.lock().await;
    //config.existing_books.push(book_id.clone());
    let book_creation_response = client.post(format!("{}/book/create?id={}&name={}&directory={}", MAIN_URL, &book_id, name, directory))
        .send()
        .await;
    match book_creation_response {
        Ok(success) => {
            if success.status() == StatusCode::CREATED {
                println!("Book {} created successfully", &book_id);
                config.as_mut().unwrap().books_data.insert(book_id, BookConfigSchema {
                    name_plugins: vec![],
                    desc_plugins: vec![],
                    directory: directory
                });
                Ok(book_id)
            }
            else {
                Err(())
            }
        }
        Err(e) => {
            log::error!("Error creating book {}: {}", &book_id, e.to_string());
            Err(())
        }
    }
}

/// Executed when frontend tries to load existing book.  
/// 
/// # Arguments
/// 
/// * `id` - id of book  
#[tauri::command]
pub async fn try_load_book(
    id: Uuid,
    app_manager: State<'_, AppManager>
) -> Result<BookDBModel, ()> {
    let client = app_manager.client.read().await;
    let response = client.get(format!("{}/book/{}", MAIN_URL, &id))
        .send()
        .await;
    match response {
        Ok(book_response) => {
            let json: Result<BookDBModel, reqwest::Error> = book_response.json().await;
            match json {
                Ok(book) => {
                    log::info!("Got book from api: {:?}", &book);
                    let mut config = app_manager.config.lock().await;
                    config.as_mut().unwrap().current_book = id.clone();
                    let mut config_file = std::fs::File::create(std::env::current_exe().unwrap().parent().unwrap().join("zz_cfg.json")).unwrap();
                    let s = serde_json::to_string_pretty(&*config).unwrap();
                    config_file.write_all(&mut s.as_bytes()).unwrap();
                    Ok(book)
                },
                Err(e) => {
                    log::error!("Error converting book from json: {}", e.to_string());
                    Err(())
                }
            }
        },
        Err(e) => {
            log::error!("Error fetching existing book: {}", e.to_string());
            Err(())
        }
    }
}

/// Executed when user starts files parsing. Texts must be parsed first cause wizforms parser depends on them 
/// 
/// # Arguments
/// 
/// * `directory` - directory of game files to parse
#[tauri::command]
pub async fn try_parse_texts(
    book_id: Uuid,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    let mut texts = app_manager.texts.lock().await;
    let config_locked = app_manager.config.lock().await;
    parse_texts(&config_locked.as_ref().unwrap(), book_id, &mut texts).await;
    Ok(())
}

/// Executed after successful texts parsing.  
/// 
/// # Arguments
/// 
/// * `book_id` - id of book to parse wizforms  
/// * `directory` - directory of game files for this book
/// 
/// # Additional
/// 
/// Fetch existing wizforms of this book to compare them with parsed ones. Needed for repeated parsings.
/// # 
#[tauri::command]
pub async fn try_parse_wizforms(
    book_id: Uuid,
    directory: String,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    log::info!("Wizforms parsing started");
    let config_locked = app_manager.config.lock().await;
    let texts = app_manager.texts.lock().await;
    let client = app_manager.client.read().await;
    let response = client.get(format!("{}/wizforms/{}", MAIN_URL, &book_id))
        .send()
        .await;
    match response {
        Ok(wizforms_response) => {
            let json: Result<Vec<WizformDBModel>, reqwest::Error> = wizforms_response.json().await;
            match json {
                Ok(existing_wizforms) => {
                    let mut wizforms = vec![];
                    parse_wizforms(book_id, &config_locked.as_ref().unwrap(), &texts, &mut wizforms, &existing_wizforms).await;
                    if wizforms.len() > 500 {
                        let second_chunk = wizforms.split_off(500);
                        upload_wizform_chunk(&wizforms, &client).await.unwrap();
                        upload_wizform_chunk(&second_chunk, &client).await.unwrap();
                        log::info!("Wizforms uploaded successfully");
                        Ok(())
                    }
                    else {
                        upload_wizform_chunk(&wizforms, &client).await.unwrap();
                        log::info!("Wizforms uploaded successfully");
                        Ok(())
                    }            
                },
                Err(e) => {
                    log::error!("Error converting exisiting wizforms from json: {}", e.to_string());
                    Err(())
                }
            }
        },
        Err(e) => {
            log::error!("Error fetching existing wizforms: {}", e.to_string());
            Err(())
        }
    }
}

/// Executed when first parsing of book is completed correctly and book must go into initualized state.  
/// 
/// # Arguments
/// 
/// * `book_id` - id of book  
#[tauri::command]
pub async fn initialize_book(
    book_id: Uuid,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    let client = app_manager.client.read().await;
    let response = client.patch(format!("{}/book/initialize/{}", MAIN_URL, &book_id))
        .send()
        .await;
    match response {
        Ok(success) => {
            log::info!("Book initialization response: {}", success.text().await.unwrap());
            Ok(())
        },
        Err(e) => {
            log::error!("Book initialization error: {}", e.to_string());
            Err(())
        }
    }
}

/// Executed when frontend tries to load all wizforms for book.  
/// 
/// # Arguments
/// 
/// * `book_id` - id of book  
#[tauri::command]
pub async fn load_wizforms(
    book_id: Uuid,
    app_manager: State<'_, AppManager>
) -> Result<Vec<WizformFrontendSimpleModel>, ()> {
    let client = app_manager.client.read().await;
    let response = client.get(format!("{}/wizforms/{}", MAIN_URL, &book_id))
        .send()
        .await;
    match response {
        Ok(response_ok) => {
            // println!("Got response of fetching existing wizforms: {}", response_ok.text().await.unwrap());
            // Err(())
            let wizforms_json: Result<Vec<WizformDBModel>, reqwest::Error> = response_ok.json().await;
            match wizforms_json {
                Ok(wizforms) => {
                    Ok(wizforms.into_iter().map(|w| {
                        WizformFrontendSimpleModel::from(w)
                    }).collect())
                },
                Err(e) => {
                    log::error!("Error converting wizforms json: {}", e.to_string());
                    Err(())
                }
            }
        },
        Err(response_fail) => {
            log::error!("Error fetching existing wizforms: {}", response_fail.to_string());
            Err(())
        }
    }
}

/// Executed when frontend tries to load all elements for book.  
/// 
/// # Arguments
/// 
/// * `book_id` - id of book 
#[tauri::command]
pub async fn load_elements(
    book_id: Uuid,
    app_manager: State<'_, AppManager>
) -> Result<Vec<ElementFrontendModel>, ()> {
    let client = app_manager.client.read().await;
    let response = client.get(format!("{}/elements/{}", MAIN_URL, &book_id))
        .send()
        .await;
    match response {
        Ok(response_ok) => {
            let elements_json: Result<Vec<ElementDBModel>, reqwest::Error> = response_ok.json().await;
            match elements_json {
                Ok(elements) => {
                    Ok(elements.into_iter().map(|e| {
                        ElementFrontendModel::from(e)
                    }).collect())
                },
                Err(e) => {
                    log::error!("Error converting elements json: {}", e.to_string());
                    Err(())
                }
            }
        },
        Err(response_fail) => {
            log::error!("Error fetching existing elements: {}", response_fail.to_string());
            Err(())
        }
    }
}

// #[tauri::command]
// pub async fn load_filters(
//     app_manager: State<'_, AppManager>,
//     book_id: String
// ) -> Result<Vec<WizformFilterDBModel>, ()> {
//     let client = app_manager.client.read().await;
//     let response = client.get("https://zz-webapi.shuttleapp.rs/book/filters")
//         .json(&HashMap::from([("value", &book_id)]))
//         .send()
//         .await;
//     match response {
//         Ok(success) => {
//             let json = success.json().await;
//             match json {
//                 Ok(filters) => {
//                     Ok(filters)
//                 },
//                 Err(e) => {
//                     log::error!("Error converting filters json: {}", e.to_string());
//                     Err(())
//                 }
//             }
//         },
//         Err(failure) => {
//             log::error!("Error fetching existing filters: {}", failure.to_string());
//             Err(())
//         }
//     }
// }

/// Executed when user updates wizform on frontend
/// 
/// # Arguments
/// 
/// * `wizform` - wizform to update 
#[tauri::command]
pub async fn update_wizform(
    wizform: WizformFrontendSimpleModel,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    let client = app_manager.client.read().await;
    let response = client.patch("https://zz-webapi.shuttleapp.rs/wizform")
        .json(&wizform)
        .send()
        .await;
    match response {
        Ok(_) => {
            log::info!("Wizform {} updated successfully", wizform.number);
            Ok(())
        },
        Err(response_fail) => {
            log::error!("Failed to update wizform {}: {}", wizform.number, response_fail.to_string());
            Err(())
        }
    }
}

#[tauri::command]
pub async fn update_wizforms(
    wizforms: Vec<WizformFrontendSimpleModel>,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    let client = app_manager.client.read().await;
    let response = client.patch("https://zz-webapi.shuttleapp.rs/wizforms")
        .json(&wizforms)
        .send()
        .await;
    match response {
        Ok(success) => {
            log::info!("Wizforms updated successfully");
            Ok(())
        },
        Err(failure) => {
            log::error!("Error updating wizforms: {}", failure.to_string());
            Err(())
        }
    }
}
/// Executed when user updates element on frontend
/// 
/// # Arguments
///
/// * `element` - element to update 
#[tauri::command]
pub async fn update_element(
    element: ElementFrontendModel,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    let client = app_manager.client.read().await;
    let response = client.patch(format!("{}/element?id={}&name={}&enabled={}", MAIN_URL, &element.id, &element.name, &element.enabled))
        .send()
        .await;
    match response {
        Ok(_) => {
            log::info!("Element {} updated successfully", element.name);
            Ok(())
        },
        Err(response_fail) => {
            log::error!("Failed to update element {}: {}", element.name, response_fail.to_string());
            Err(())
        }
    }
}

// #[tauri::command]
// pub async fn update_filter(
//     filter: WizformFilterDBModel,
//     app_manager: State<'_, AppManager>
// ) -> Result<(), ()> {
//     let client = app_manager.client.read().await;
//     let response = client.patch("https://zz-webapi.shuttleapp.rs/book/filters")
//         .json(&filter)
//         .send()
//         .await;
//     match response {
//         Ok(_success) => {
//             log::info!("Filter updated successfully");
//             Ok(())
//         },
//         Err(failure) => {
//             log::error!("Error updating filter: {}", failure.to_string());
//             Err(())
//         }
//     }
// }

// #[tauri::command]
// pub async fn create_spawn_point(
//     book_id: String,
//     name: String,
//     app_manager: State<'_, AppManager>
// ) -> Result<WizformSpawnPoint, ()> {
//     let point = WizformSpawnPoint {
//         id: uuid::Uuid::new_v4().to_string().replace("-", ""),
//         book_id: book_id,
//         name: name
//     };
//     let client = app_manager.client.read().await;
//     let response = client.post("https://zz-webapi.shuttleapp.rs/book/point")
//         .json(&point)
//         .send()
//         .await;
//     match response {
//         Ok(_success) => {
//             log::info!("Spawn point {} created successfully with id {}", &point.name, &point.id);
//             Ok(point)
//         }
//         Err(failure) => {
//             log::error!("Failed to create spawn point {}: {}", &point.name, failure.to_string());
//             Err(())
//         }
//     }
// }

// #[tauri::command]
// pub async fn remove_spawn_point(
//     point_id: String,
//     app_manager: State<'_, AppManager>
// ) -> Result<(), ()> {
//     let client = app_manager.client.read().await;
//     let response = client.delete(format!("https://zz-webapi.shuttleapp.rs/book/point/remove/{}", &point_id))
//         .send()
//         .await;
//     match response {
//         Ok(_success) => {
//             log::trace!("Spawn point {} deleted successfully", &point_id);
//             Ok(())
//         }
//         Err(failure) => {
//             log::error!("Failed to delete spawn point {}: {}", &point_id, failure.to_string());
//             Err(())
//         }
//     }
// }

// #[tauri::command]
// pub async fn get_spawn_points(
//     book_id: String,
//     app_manager: State<'_, AppManager>
// ) -> Result<Vec<WizformSpawnPoint>, ()> {
//     let client = app_manager.client.read().await;
//     let response = client.get(format!("https://zz-webapi.shuttleapp.rs/book/points/{}", &book_id))
//         .send()
//         .await;
//     match response {
//         Ok(success) => {
//             log::trace!("Spawn points fetched successfully for book {}", &book_id);
//             let json: Result<Vec<WizformSpawnPoint>, reqwest::Error> = success.json().await;
//             match json {
//                 Ok(points) => {
//                     log::trace!("Spawn points json converted successfully");
//                     Ok(points)
//                 },
//                 Err(failure) => {
//                     log::error!("Error converting spawn points json: {}", failure.to_string());
//                     Err(())
//                 }
//             }
//         }
//         Err(failure) => {
//             log::error!("Failed to fetch spawn points for book {}: {}", &book_id, failure.to_string());
//             Err(())
//         }
//     }
// }

#[tauri::command]
pub async fn load_wizform(
    id: Uuid,
    app_manager: State<'_, AppManager>
) -> Result<WizformFrontendFullModel, ()> {
    let client = app_manager.client.read().await;
    let response = client.get(format!("{}/wizform/{}", MAIN_URL, &id))
        .send()
        .await;
    match response {
        Ok(success) => {
            let json: Result<WizformDBModel, reqwest::Error> = success.json().await;
            match json {
                Ok(wizform) => {
                    Ok(WizformFrontendFullModel::from(wizform))
                },
                Err(json_error) => {
                    log::error!("Failed to parse wizform {} json: {}", &id, json_error.to_string());
                    Err(())
                }
            }
        },
        Err(failure) => {
            log::error!("Failed to fetch wizform {} data: {}", &id, failure.to_string());
            Err(())
        }
    }
}

#[tauri::command]
pub async fn update_wizform_visibility(
    id: Uuid,
    enabled: bool,
    app_manager: State<'_, AppManager> 
) -> Result<(), ()> {
    let client = app_manager.client.read().await;
    let response = client.patch(format!("{}/wizform/{}/update?enabled={}", MAIN_URL, &id, enabled))
        .send()
        .await;
    match response {
        Ok(_success) => {
            log::info!("Visibility of wizform {} updated successfully", &id);
            Ok(())
        },
        Err(failure) => {
            log::error!("Failed to update visibility of wizform {}: {}", &id, failure.to_string());
            Err(())
        }
    }
}

#[tauri::command]
pub async fn update_wizform_element(
    id: Uuid,
    element: i16,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    let client = app_manager.client.read().await;
    let response = client.patch(format!("{}/wizform/{}/update?element={}", MAIN_URL, &id, element))
        .send()
        .await;
    match response {
        Ok(_success) => {
            log::info!("Element of wizform {} updated successfully", &id);
            Ok(())
        },
        Err(failure) => {
            log::error!("Failed to update element of wizform {}: {}", &id, failure.to_string());
            Err(())
        }
    }
}