use std::{collections::HashMap, str::FromStr};

use uuid::Uuid;

use crate::{error::ZZParserError, services::prelude::BookFullModel};

use super::config::BookConfigSchema;

pub fn check_local_book(book: &mut BookFullModel, local_books_data: &HashMap<Uuid, BookConfigSchema>) -> Result<(), ZZParserError> {
    if let Some(local_book) = local_books_data.get(&Uuid::from_str(book.id.inner())?) {
        book.directory = local_book.directory.clone()
    } else {
        return Err(ZZParserError::Unknown);
    }
    Ok(())
}