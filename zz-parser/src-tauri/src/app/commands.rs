use std::path::PathBuf;

use tauri::State;

use crate::{error::ZZParserError, services::prelude::{ParseProcessor, ZanzarahApiService}};

use super::config::AppConfig;

#[tauri::command]
pub async fn start_parsing(
    app_config: State<'_, AppConfig>,
    zanzarah_service: State<'_, ZanzarahApiService>
) -> Result<(), ZZParserError> {
    let current_book_config = app_config.books_data.get(&app_config.current_book).unwrap();
    let mut parser = ParseProcessor::new(&current_book_config.name_plugins, &current_book_config.desc_plugins);
    parser
        .parse_texts(PathBuf::from(current_book_config.directory.clone()))
        .inspect_err(|error| {
            log::error!("Failed to parse texts: {:#?}", error);
        })?;
    let wizforms = parser
        .parse_wizforms(PathBuf::from(current_book_config.directory.clone()), app_config.current_book)
        .inspect_err(|error| {
            log::error!("Failed to parse wizforms: {:#?}", error);
        })?;
    match zanzarah_service.upload_wizforms(wizforms).await {
        Ok(success) => {
            log::info!("Wizforms upload result: {}", success.message);
            Ok(())
        },
        Err(error) => {
            log::error!("Failed to upload wizforms: {:#?}", &error);
            Err(error)
        }
    }
}