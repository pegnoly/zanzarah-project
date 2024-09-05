use std::collections::HashMap;
use tauri::State;

use super::source::{parse_texts, parse_wizforms, ParseController};

#[tauri::command]
pub async fn try_create_book(
    name: String
) -> Result<(), ()> {
    let client = reqwest::Client::new();
    let id = uuid::Uuid::new_v4().to_string();
    let ok = client.get("https://zz-webapi.shuttleapp.rs/books/create")
        .json(&HashMap::from([("id", id), ("name", name)]))
        .send().await.unwrap();
    println!("Got responce: {:?}", &ok);
    Ok(())
}

#[tauri::command]
pub async fn try_parse_texts(
    controller: State<'_, ParseController>
) -> Result<(), ()> {
    let mut texts = controller.texts.write().await;
    parse_texts(&mut texts).await;
    Ok(())
}

#[tauri::command]
pub async fn try_parse_wizforms(
    controller: State<'_, ParseController>
) -> Result<Vec<String>, ()> {
    let texts = controller.texts.read().await;
    let mut wizforms = controller.wizforms.lock().await;
    parse_wizforms(&mut wizforms, &texts).await;
    Ok(wizforms.iter().map(|w| w.name.clone()).collect())
}