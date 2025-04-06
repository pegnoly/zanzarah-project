pub mod parser;

use parser::utils::AppManager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub async fn run() {
    //test1();
    tauri::Builder::default()
        .manage(AppManager::new().await)
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            parser::commands::try_pick_directory,
            parser::commands::try_create_book,
            parser::commands::try_load_book,
            parser::commands::try_parse_texts,
            parser::commands::try_parse_wizforms,
            parser::commands::load_wizforms,
            parser::commands::load_elements,
            parser::commands::load_existing_books_info,
            parser::commands::load_current_book_info,
            parser::commands::initialize_book,
            parser::commands::update_wizform,
            parser::commands::update_wizforms,
            parser::commands::update_element,
            parser::commands::load_wizform,
            parser::commands::update_wizform_visibility,
            parser::commands::update_wizform_element
            // parser::commands::load_filters,
            // parser::commands::update_filter,
            // parser::commands::create_spawn_point,
            // parser::commands::remove_spawn_point,
            // parser::commands::get_spawn_points
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
