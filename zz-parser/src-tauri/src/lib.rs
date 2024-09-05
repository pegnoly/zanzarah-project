use parser::source::ParseController;
use tokio::sync::{Mutex, RwLock};

pub mod parser;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(ParseController {
            texts: RwLock::default(),
            wizforms: Mutex::default()
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            parser::commands::try_create_book,
            parser::commands::try_parse_texts,
            parser::commands::try_parse_wizforms
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}