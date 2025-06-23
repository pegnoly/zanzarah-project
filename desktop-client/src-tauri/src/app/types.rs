use std::str::FromStr;

use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{error::ZZParserError, services::prelude::BookFullModel};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct BookFrontendModel {
    pub id: Uuid,
    pub name: String,
    pub directory: String,
    pub initialized: bool,
    pub available: bool,
    pub version: String
}

impl TryFrom<BookFullModel> for BookFrontendModel {
    type Error = ZZParserError;
    fn try_from(value: BookFullModel) -> Result<Self, Self::Error> {
        Ok(BookFrontendModel {
            id: Uuid::from_str(value.id.inner())?,
            name: value.name,
            directory: value.directory,
            initialized: value.initialized,
            available: value.available,
            version: value.version
        })
    }
}