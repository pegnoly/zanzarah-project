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
            parser::commands::upload_book,
            parser::commands::load_filters,
            parser::commands::update_filter
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

pub fn test1() {
    let path = "D:\\Program Files (x86)\\Zanzarah The Hidden Portal\\Resources\\Bitmaps\\WIZ000T.BMP";
    let open_ok = bmp::open(path);
    match open_ok {
        Ok(img) => {
            let mut new_test_img = bmp::Image::new(40, 40);
            for (x, y) in new_test_img.coordinates() {
                let pixel = img.get_pixel(x, y);
                new_test_img.set_pixel(x, y, pixel);
            }
            let new_img_path = "D:\\test.bmp";
            new_test_img.save(new_img_path).unwrap();
        },
        Err(e) => {
            println!("Failed to open bitmap");
        }
    }
}