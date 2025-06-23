use app::prelude::{load_books, load_current_book, load_elements, load_wizform_for_edit, load_wizforms, start_parsing, test, update_wizform_display_status, update_wizform_element, AppConfig};
use argon2::password_hash::{rand_core::OsRng, SaltString};
use reqwest::Client;
use services::prelude::ZanzarahApiService;

use crate::app::prelude::create_book;

mod app;
mod services;
mod error;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    let salt = SaltString::generate(&mut OsRng).to_string();
    println!("Salt: {}", salt);
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
            test,
            // try_register_user,
            // try_confirm_email,
            load_books,
            create_book,
            load_current_book,
            start_parsing,
            load_wizforms,
            load_wizform_for_edit,
            load_elements,
            update_wizform_display_status,
            update_wizform_element
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
