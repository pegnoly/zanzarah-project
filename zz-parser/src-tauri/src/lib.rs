use std::{collections::HashMap, io::Write, str::FromStr};

use app::prelude::{start_parsing, AppConfig, BookConfigSchema};
use reqwest::Client;
use services::prelude::{NamePluginType, SymbolRemover, ZanzarahApiService};
use uuid::Uuid;

mod app;
mod services;
mod error;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let exe_path = std::env::current_exe().unwrap();
    let exe_dir = exe_path.parent().unwrap();
    let config_data = std::fs::read_to_string(exe_dir.join("cfg/zz_cfg.json")).unwrap();
    let config = serde_json::from_str::<AppConfig>(&config_data).unwrap();
    tauri::Builder::default()
        .manage(config)
        .manage(ZanzarahApiService::new(Client::new()))
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            start_parsing
            // parser::commands::try_pick_directory,
            // parser::commands::try_create_book,
            // parser::commands::try_load_book,
            // parser::commands::try_parse_texts,
            // parser::commands::try_parse_wizforms,
            // parser::commands::load_wizforms,
            // parser::commands::load_elements,
            // parser::commands::load_existing_books_info,
            // parser::commands::load_current_book_info,
            // parser::commands::initialize_book,
            // parser::commands::update_wizform,
            // parser::commands::update_wizforms,
            // parser::commands::update_element,
            // parser::commands::load_wizform,
            // parser::commands::update_wizform_visibility,
            // parser::commands::update_wizform_element
            // parser::commands::load_filters,
            // parser::commands::update_filter,
            // parser::commands::create_spawn_point,
            // parser::commands::remove_spawn_point,
            // parser::commands::get_spawn_points
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
