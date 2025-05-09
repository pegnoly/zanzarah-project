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
    pub major_version: i32,
    pub minor_version: i32,
    pub patch_version: i32
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
            major_version: value.major_version,
            minor_version: value.minor_version,
            patch_version: value.patch_version
        })
    }
}