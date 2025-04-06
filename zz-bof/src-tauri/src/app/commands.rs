use itertools::Itertools;
use tauri::State;
use uuid::Uuid;

use crate::{error::ZZBookError, services::prelude::*};

#[tauri::command]
pub async fn load_books(
    zanzarah_service: State<'_, ZanzarahApiService>
) -> Result<Option<Vec<BookModel>>, ZZBookError> {  
    match zanzarah_service.get_books(GetBooks { available: Some(true) }).await {
        Ok(books) =>  {
            Ok(books)
        }, 
        Err(error) => {
            println!("Error in load_books command: {:#}", &error);
            Err(error)
        }
    }
}

#[tauri::command]
pub async fn load_elements(
    zanzarah_service: State<'_, ZanzarahApiService>,
    book_id: Uuid
) -> Result<Option<Vec<ElementModel>>, ZZBookError> {
    match zanzarah_service.get_elements(GetElements::new(book_id).enabled(Some(true))).await {
        Ok(elements) => {
            Ok(elements)
        },
        Err(error) => {
            println!("Error in load_elements command: {:#}", &error);
            Err(error)
        }
    }
}

#[tauri::command]
pub async fn build_wizforms_list(
    zanzarah_service: State<'_, ZanzarahApiService>,
    book_id: Uuid,
    element: Option<WizformElementType>,
    name: Option<String>
) -> Result<Option<Vec<WizformListModel>>, ZZBookError> {
    let payload = GetWizformsList::new(book_id)
        .enabled(Some(true))
        .with_element(element)
        .with_name(name);
    match zanzarah_service.get_wizforms_list(payload).await {
        Ok(wizforms) => {
            Ok(wizforms)
        },
        Err(error) => {
            println!("Error in load_wizforms command: {:#}", &error);
            Err(error)
        }
    }
}

#[tauri::command]
pub async fn focus_wizform(
    zanzarah_service: State<'_, ZanzarahApiService>,
    id: Uuid
) -> Result<Option<WizformFocused>, ZZBookError> {
    match zanzarah_service.get_wizform_focused(GetWizformFocused { id }).await {
        Ok(wizform) => {
            if let Some(mut wizform) = wizform {
                let magics_deduplicated = wizform.magics.types.clone().into_iter()
                    .unique_by(|magic| magic.level)
                    .collect_vec();
                wizform.magics.types = magics_deduplicated;
                //println!("Magics after removing duplicates: {:#?}", &wizform.magics.types);
                Ok(Some(wizform)) 
            } else {
                Ok(None)
            }
        },
        Err(error) => {
            println!("Error in focus_wizform command: {:#}", &error);
            Err(error)
        }
    }
}