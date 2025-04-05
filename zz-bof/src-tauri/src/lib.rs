mod app;
mod services;
mod error;

use tauri::{Manager, RunEvent};
use services::prelude::*;
use reqwest::Client;
use app::prelude::*;
use tokio::sync::{Mutex, RwLock};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    tauri::Builder::default()
        .manage(ZanzarahApiService::new(Client::new()))
        .manage(LocalDataContainer { current_book: Mutex::new(None), wizforms: RwLock::new(vec![])})
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            load_books,
            load_elements,
            build_wizforms_list
            // book::commands::load_app,
            // book::commands::load_wizforms,
            // book::commands::load_elements,
            // book::commands::load_wizform
        ])
        .setup(|app| {
            println!("dir is {:?}", app.path().data_dir().unwrap().to_str().unwrap());
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while running tauri application")
        .run(|_app_handle, event| {
            match event {
                RunEvent::Exit => {
                    println!("Exit!");
                },
                _ => {}
            }
        });
}
