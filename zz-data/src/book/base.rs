use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct BookDBModel {
    pub id: Uuid,
    pub name: String,
    pub directory: String,
    pub initialized: bool,
    pub downloadable: bool,
    pub major_version: i16,
    pub minor_version: i16,
    pub patch_version: i16
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct FilterDBModel {
    pub id: Uuid,
    pub book_id: Uuid,
    pub name: String,
    pub enabled: bool 
}