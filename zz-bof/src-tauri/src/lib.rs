pub mod book;

use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(crate::book::utils::LocalAppManager::new())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            book::commands::load_books,
            book::commands::load_wizforms,
            book::commands::load_elements,
            book::commands::load_filters
        ])
        .setup(|app| {
            println!("dir is {:?}", app.path().data_dir().unwrap().to_str().unwrap());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
