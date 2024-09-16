use std::{collections::HashMap, io::Write};

use tauri::{AppHandle, Manager, State};
use zz_data::{book::base::{Book, WizformFilterDBModel}, core::wizform::{WizformDBModel, WizformElementFrontendModel, WizformElementModel}};

use super::utils::{LocalAppManager, WizformMobileFrontendModel};

#[tauri::command]
pub async fn load_books(
    app_manager: State<'_, LocalAppManager>
) -> Result<Vec<Book>, String> {
    let client = app_manager.client.read().await;
    let response = client.get("https://zz-webapi.shuttleapp.rs/book/all")
        .send()
        .await;
    match response {
        Ok(books_response) => {
            let json: Result<Vec<Book>, reqwest::Error> = books_response.json().await;
            match json {
                Ok(books) => {
                    Ok(books)
                },
                Err(e) => {
                    println!("Error converting books from json: {}", e.to_string());
                    Err("Error converting books from json".to_string())
                }
            }
        },
        Err(e) => {
            println!("Error fetching existing books: {}", e.to_string());
            Err("Error fetching existing books".to_string())
        }
    }
}


#[tauri::command]
pub async fn load_wizforms(
    book_id: String,
    app: AppHandle,
    app_manager: State<'_, LocalAppManager>
) -> Result<Vec<WizformMobileFrontendModel>, ()> {
    let book_data_path = app.path().data_dir().unwrap().join(format!("{}\\", &book_id));
    let wizforms_data_path = book_data_path.join("wizforms.json");
    if wizforms_data_path.exists() {
        println!("Reading wizforms from json file");
        let wizforms: Result<Vec<WizformDBModel>, serde_json::Error> = serde_json::from_str(&std::fs::read_to_string(&wizforms_data_path).unwrap());
        Ok(wizforms.unwrap().iter().map(|w| {
            WizformMobileFrontendModel::from(w)
        }).collect())
    }
    else {
        let client = app_manager.client.read().await;
        let response = client.get("https://zz-webapi.shuttleapp.rs/wizforms")
            .json(&HashMap::from([("value", &book_id)]))
            .send()
            .await;
        match response {
            Ok(response_ok) => {
                let json: Result<Vec<WizformDBModel>, reqwest::Error> = response_ok.json().await;
                match json {
                    Ok(wizforms) => {
                        if book_data_path.exists() == false {
                            std::fs::create_dir(book_data_path).unwrap();
                        }
                        let mut file = std::fs::File::create(&wizforms_data_path).unwrap();
                        let s = serde_json::to_string_pretty(&wizforms).unwrap();
                        file.write_all(&mut s.as_bytes()).unwrap();
                        Ok(wizforms.iter().map(|w| {
                            WizformMobileFrontendModel::from(w)
                        }).collect())
                    },
                    Err(e) => {
                        println!("Failed to parse enabled wizforms json: {}", e.to_string());
                        Err(())
                    }
                }
            },
            Err(e) => {
                println!("Failed to fetch enabled wizforms: {}", e.to_string());
                Err(())
            }
        }
    }
}

#[tauri::command]
pub async fn load_elements(
    book_id: String,
    app: AppHandle,
    app_manager: State<'_, LocalAppManager>
) -> Result<Vec<WizformElementFrontendModel>, ()> {
    let book_data_path = app.path().data_dir().unwrap().join(format!("{}\\", &book_id));
    let elements_data_path = book_data_path.join("elements.json");
    if elements_data_path.exists() {
        println!("Reading elements from json file");
        let elements: Result<Vec<WizformElementModel>, serde_json::Error> = serde_json::from_str(&std::fs::read_to_string(&elements_data_path).unwrap());
        Ok(elements.unwrap().iter()
            .filter(|e| {e.enabled})
            .map(|e| {
                WizformElementFrontendModel {
                    id: e.id.clone(),
                    element: e.element.clone() as i32,
                    name: e.name.clone(),
                    enabled: e.enabled
                }
            })
            .collect())
    }
    else {
        let client = app_manager.client.read().await;
        let response = client.get("https://zz-webapi.shuttleapp.rs/elements")
            .json(&HashMap::from([("value", &book_id)]))
            .send()
            .await;
        match response {
            Ok(response_ok) => {
                let json: Result<Vec<WizformElementModel>, reqwest::Error> = response_ok.json().await;
                match json {
                    Ok(elements) => {
                        if book_data_path.exists() == false {
                            std::fs::create_dir(book_data_path).unwrap();
                        }
                        let mut file = std::fs::File::create(&elements_data_path).unwrap();
                        let s = serde_json::to_string_pretty(&elements).unwrap();
                        file.write_all(&mut s.as_bytes()).unwrap();
                        Ok(elements.iter()
                                .filter(|e| {e.enabled})
                                .map(|e| {
                                    WizformElementFrontendModel {
                                        id: e.id.clone(),
                                        element: e.element.clone() as i32,
                                        name: e.name.clone(),
                                        enabled: e.enabled
                                    }
                                })
                                .collect())
                    },
                    Err(e) => {
                        println!("Failed to parse elements json: {}", e.to_string());
                        Err(())
                    }
                }
            },
            Err(e) => {
                println!("Failed to fetch elements: {}", e.to_string());
                Err(())
            }
        }
    }
}

#[tauri::command]
pub async fn load_filters(
    book_id: String,
    app: AppHandle,
    app_manager: State<'_, LocalAppManager>
) -> Result<Vec<WizformFilterDBModel>, ()> {
    let book_data_path = app.path().data_dir().unwrap().join(format!("{}\\", &book_id));
    let filters_data_path = book_data_path.join("filters.json");
    if filters_data_path.exists() {
        println!("Reading filters from json file");
        let filters: Result<Vec<WizformFilterDBModel>, serde_json::Error> = serde_json::from_str(&std::fs::read_to_string(&filters_data_path).unwrap());
        Ok(filters.unwrap())
    }
    else {
        let client = app_manager.client.read().await;
        let response = client.get("https://zz-webapi.shuttleapp.rs/book/filters")
            .json(&HashMap::from([("value", &book_id)]))
            .send()
            .await;
        match response {
            Ok(response_ok) => {
                let json: Result<Vec<WizformFilterDBModel>, reqwest::Error> = response_ok.json().await;
                match json {
                    Ok(filters) => {
                        if book_data_path.exists() == false {
                            std::fs::create_dir(book_data_path).unwrap();
                        }
                        let mut file = std::fs::File::create(&filters_data_path).unwrap();
                        let s = serde_json::to_string_pretty(&filters).unwrap();
                        file.write_all(&mut s.as_bytes()).unwrap();
                        Ok(filters)
                    },
                    Err(e) => {
                        println!("Failed to parse filters json: {}", e.to_string());
                        Err(())
                    }
                }
            },
            Err(e) => {
                println!("Failed to fetch filters: {}", e.to_string());
                Err(())
            }
        }
    }
}