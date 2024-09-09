use std::{collections::HashMap, io::Write};

use strum::IntoEnumIterator;
use tauri::{AppHandle, Emitter, State};
use tauri_plugin_dialog::DialogExt;
use zz_data::{
    book::base::{
        Book, BookCreationParams
    }, 
    core::wizform::{
        WizformDBModel, WizformElementFrontendModel, WizformElementModel, WizformElementType, WizformFrontendModel
    }
};

use super::{
    source::{
        parse_texts, 
        parse_wizforms
    }, 
    utils::AppManager
};

/// Executed on frontend startup, on success returns ids of locally stored books.
/// #
#[tauri::command]
pub async fn load_existing_books_info(
    app_manager: State<'_, AppManager>
) -> Result<Vec<String>, ()> {
    let config_locked = app_manager.config.lock().await;
    Ok(config_locked.existing_books.clone())
}

/// Executed on frontend startup, on success returns id of last edited book.
/// #
#[tauri::command]
pub async fn load_current_book_info(
    app_manager: State<'_, AppManager>
) -> Result<String, ()> {
    let config_locked = app_manager.config.lock().await; 
    Ok(config_locked.current_book.clone())
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
) -> Result<String, ()> {
    let client = app_manager.client.read().await;
    let book_id = uuid::Uuid::new_v4().to_string().replace("-", "");
    let book_to_create = BookCreationParams {
        id: book_id.clone(),
        name: name,
        directory: directory,
        elements: WizformElementType::iter().map(
            |wf| {
                WizformElementModel {
                    id: uuid::Uuid::new_v4().to_string().replace("-", ""),
                    book_id: book_id.clone(),
                    element: wf.clone(),
                    name: wf.to_string(),
                    enabled: match wf {
                        WizformElementType::Custom1 | WizformElementType::Custom2 | 
                        WizformElementType::Custom3 | WizformElementType::Custom4 |
                        WizformElementType::Custom5 => {
                            false
                        },
                        _=> true
                    }
                }
            }
        ).collect()
    };
    let mut config = app_manager.config.lock().await;
    config.existing_books.push(book_id.clone());
    let book_creation_response = client.post("https://zz-webapi.shuttleapp.rs/book")
        .json(&book_to_create)
        .send()
        .await;
    match book_creation_response {
        Ok(response_success) => {
            println!("Book {} created successfully with response: {}", &book_id, &response_success.text().await.unwrap());
            Ok(book_id)
        }
        Err(e) => {
            println!("Error creating book {}: {}", &book_id, e.to_string());
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
    id: String,
    app_manager: State<'_, AppManager>
) -> Result<Book, String> {
    let client = app_manager.client.read().await;
    let response = client.get("https://zz-webapi.shuttleapp.rs/book")
        .json(&HashMap::from([("value", &id)]))
        .send()
        .await;
    match response {
        Ok(book_response) => {
            let json: Result<Book, reqwest::Error> = book_response.json().await;
            match json {
                Ok(book) => {
                    println!("Got book from api: {:?}", &book);
                    let mut config = app_manager.config.lock().await;
                    config.current_book = id.clone();
                    let mut config_file = std::fs::File::create(std::env::current_exe().unwrap().parent().unwrap().join("zz_cfg.json")).unwrap();
                    let s = serde_json::to_string_pretty(&*config).unwrap();
                    config_file.write_all(&mut s.as_bytes()).unwrap();
                    Ok(book)
                },
                Err(e) => {
                    println!("Error converting book from json: {}", e.to_string());
                    Err("Error converting book from json".to_string())
                }
            }
        },
        Err(e) => {
            println!("Error fetching existing book: {}", e.to_string());
            Err("Error fetching existing book".to_string())
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
    directory: String,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    let mut texts = app_manager.texts.lock().await;
    parse_texts(directory, &mut texts).await;
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
    book_id: String,
    directory: String,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    println!("Trying to parse wizforms");
    let texts = app_manager.texts.lock().await;
    let client = app_manager.client.read().await;
    let response = client.get("https://zz-webapi.shuttleapp.rs/wizforms")
        .json(&HashMap::from([("value", &book_id)]))
        .send()
        .await;
    match response {
        Ok(wizforms_response) => {
            let json: Result<Vec<WizformDBModel>, reqwest::Error> = wizforms_response.json().await;
            match json {
                Ok(existing_wizforms) => {
                    println!("Existing wizforms: {:?}", &existing_wizforms);
                    let mut wizforms = vec![];
                    parse_wizforms(book_id, directory, &texts, &mut wizforms, &existing_wizforms).await;
                    let wizform_load_response = client.post("https://zz-webapi.shuttleapp.rs/wizforms")
                        .json(&wizforms)
                        .send()
                        .await;
                    match wizform_load_response {
                        Ok(response_ok) => {
                            println!("Uploading wizforms response: {}", &response_ok.text().await.unwrap());
                            Ok(())
                        },
                        Err(response_err) => {
                            println!("Uploading wizforms response error: {}", &response_err.to_string());
                            Err(())
                        }
                    }               
                },
                Err(e) => {
                    println!("Error converting exisiting wizforms from json: {}", e.to_string());
                    Err(())
                }
            }
        },
        Err(e) => {
            println!("Error fetching existing wizforms: {}", e.to_string());
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
    book_id: String,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    let client = app_manager.client.read().await;
    let response = client.patch("https://zz-webapi.shuttleapp.rs/book/initialize")
        .json(&HashMap::from([("value", Some(book_id))]))
        .send()
        .await;
    match response {
        Ok(success) => {
            println!("Book initialization response: {}", success.text().await.unwrap());
            Ok(())
        },
        Err(e) => {
            println!("Book initialization error: {}", e.to_string());
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
    book_id: String,
    app_manager: State<'_, AppManager>
) -> Result<Vec<WizformFrontendModel>, ()> {
    let client = app_manager.client.read().await;
    let response = client.get("https://zz-webapi.shuttleapp.rs/wizforms")
        .json(&HashMap::from([("value", &book_id)]))
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
                        WizformFrontendModel {
                            id: w.id,
                            name: w.name,
                            element: w.element as i32,
                            enabled: w.enabled
                        }}).collect())
                },
                Err(e) => {
                    println!("Error converting wizforms json: {}", e.to_string());
                    Err(())
                }
            }
        },
        Err(response_fail) => {
            println!("Error fetching existing wizforms: {}", response_fail.to_string());
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
    book_id: String,
    app_manager: State<'_, AppManager>
) -> Result<Vec<WizformElementFrontendModel>, ()> {
    let client = app_manager.client.read().await;
    let response = client.get("https://zz-webapi.shuttleapp.rs/elements")
        .json(&HashMap::from([("value", &book_id)]))
        .send()
        .await;
    match response {
        Ok(response_ok) => {
            let elements_json: Result<Vec<WizformElementModel>, reqwest::Error> = response_ok.json().await;
            match elements_json {
                Ok(elements) => {
                    Ok(elements.into_iter().map(|e| {
                        WizformElementFrontendModel {
                            id: e.id,
                            name: e.name,
                            element: e.element as i32,
                            enabled: e.enabled
                        }}).collect())
                },
                Err(e) => {
                    println!("Error converting elements json: {}", e.to_string());
                    Err(())
                }
            }
        },
        Err(response_fail) => {
            println!("Error fetching existing elements: {}", response_fail.to_string());
            Err(())
        }
    }
}

/// Executed when user updates wizform on frontend
/// 
/// # Arguments
/// 
/// * `wizform` - wizform to update 
#[tauri::command]
pub async fn update_wizform(
    wizform: WizformFrontendModel,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    let client = app_manager.client.read().await;
    let response = client.patch("https://zz-webapi.shuttleapp.rs/wizform")
        .json(&wizform)
        .send()
        .await;
    match response {
        Ok(_) => {
            println!("Wizform {} updated successfully", wizform.name);
            Ok(())
        },
        Err(response_fail) => {
            println!("Failed to update wizform {}: {}", wizform.name, response_fail.to_string());
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
    element: WizformElementFrontendModel,
    app_manager: State<'_, AppManager>
) -> Result<(), ()> {
    let client = app_manager.client.read().await;
    let response = client.patch("https://zz-webapi.shuttleapp.rs/element")
        .json(&element)
        .send()
        .await;
    match response {
        Ok(_) => {
            println!("Element {} updated successfully", element.name);
            Ok(())
        },
        Err(response_fail) => {
            println!("Failed to update element {}: {}", element.name, response_fail.to_string());
            Err(())
        }
    }
}