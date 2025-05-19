use std::{collections::HashMap, path::PathBuf, str::FromStr};

use argon2::{password_hash::{rand_core::OsRng, PasswordHasher, PasswordVerifier, SaltString}, Argon2, PasswordHash};
use itertools::Itertools;
use serde::de;
use tauri::State;
use uuid::Uuid;

use crate::{error::ZZParserError, services::prelude::{BookFullModel, ConfirmEmailPayload, ElementModel, ElementsPayload, FilterWizformsPayload, ParseProcessor, RegisterUserPayload, WizformEditableModel, WizformElementType, WizformSimpleModel, ZanzarahApiService}};

use super::{config::{AppConfig, BookConfigSchema}, types::BookFrontendModel, utils::check_local_book};

#[tauri::command]
pub async fn load_books(
    app_config: State<'_, AppConfig>,
    zanzarah_service: State<'_, ZanzarahApiService>
) -> Result<Vec<BookFrontendModel>, ZZParserError> {
    if let Some(mut books) = zanzarah_service.get_books().await? {
        //println!("Got some books from api: {:#?}", &books);
        let local_books_compared = books.iter_mut()
            .filter_map(|book| {
                if let Err(error) = check_local_book(book, &app_config.books_data) {
                    //log::error!("Failed to compare local book data with db one: {:?}", &error);
                    None
                } else {
                    BookFrontendModel::try_from(book.clone()).ok()
                }
            })
            .collect_vec();
        //println!("Got books that exist locally: {:#?}", &local_books_compared);
        Ok(local_books_compared)
    } else {
        //println!("Got no books...");
        Ok(vec![])
    }
}

#[tauri::command]
pub async fn load_current_book(
    //zanzarah_service: State<'_, ZanzarahApiService>,
    app_config: State<'_, AppConfig>,
) -> Result<Uuid, ZZParserError> {
    // if let Some(books) = zanzarah_service.get_books().await? {
    //     if let Some(book) = books.into_iter().find(|b| Uuid::from_str(b.id.inner()).unwrap() == app_config.current_book) {
    //         Ok(Some(BookFrontendModel::try_from(book).unwrap()))
    //     } else {
    //         Ok(None)
    //     }
    // } else {
    //     Ok(None)
    // }
    Ok(app_config.current_book)
}

#[tauri::command]
pub async fn test(
    zanzarah_service: State<'_, ZanzarahApiService>
) -> Result<(), ()> {
    // let password = b"ft314rthhtyj1111";
    // let salt = SaltString::generate(&mut OsRng);
    // let argon2 = Argon2::default();
    // let password_hash = argon2.hash_password(password, &salt).unwrap().to_string();
    // println!("Hash: {}", &password_hash);
    // let parsed_hash = PasswordHash::new(&password_hash).unwrap();
    // if let Ok(()) = argon2.verify_password(password, &parsed_hash) {
    //     println!("Password verified!")
    // }
    // let device_id = machine_uid::get().unwrap();
    // println!("Device id: {}", &device_id);
    Ok(())
}

#[tauri::command]
pub async fn try_register_user(
    zanzarah_service: State<'_, ZanzarahApiService>,
    email: String,
    password: String
) -> Result<String, ZZParserError> {
    let hash_generator = Argon2::default();
    let salt = SaltString::generate(&mut OsRng);
    let hash = hash_generator.hash_password(password.as_bytes(), &salt).unwrap().to_string();
    let payload = RegisterUserPayload {email, password: hash};
    match zanzarah_service.register_user(payload).await {
        Ok(response) => {
            Ok(response.message)
        },
        Err(error) => {
            log::error!("Failed to register user: {:#?}", &error);
            Err(error)
        }
    }
}

#[tauri::command]
pub async fn try_confirm_email(
    zanzarah_service: State<'_, ZanzarahApiService>,
    email: String,
    code: String
) -> Result<String, ZZParserError> {
    println!("Email: {}, code: {}", &email, &code);
    let payload = ConfirmEmailPayload { email, code };
    match zanzarah_service.confirm_email(payload).await {
        Ok(response) => {
            Ok(response.message)
        },
        Err(error) => {
            log::error!("Failed to confirm email: {:#?}", &error);
            Err(error)
        }
    }
}

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

#[tauri::command]
pub async fn load_elements(
    zanzarah_service: State<'_, ZanzarahApiService>,
    book_id: Uuid
) -> Result<Vec<ElementModel>, ZZParserError> {
    zanzarah_service.load_elements(ElementsPayload::new(book_id)).await
}

#[tauri::command]
pub async fn load_wizforms(
    zanzarah_service: State<'_, ZanzarahApiService>,
    book_id: Uuid,
    element: WizformElementType,
    name: String
) -> Result<Vec<WizformSimpleModel>, ZZParserError> {
    let payload = FilterWizformsPayload {book_id, element, name};
    zanzarah_service.get_wizforms(payload).await
}

#[tauri::command]
pub async fn load_wizform_for_edit(
    zanzarah_service: State<'_, ZanzarahApiService>,
    id: Uuid
) -> Result<Option<WizformEditableModel>, ZZParserError> {
    if let Some(wizform) = zanzarah_service.get_wizform(id).await? {
        Ok(Some(wizform))
    } else {
        Ok(None)
    }
}