use serde::{Deserialize, Serialize};

use crate::core::wizform::{WizformDBModel, WizformElementModel};

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct Book {
    pub id: String,
    pub name: String,
    pub initialized: bool,
    pub directory: String,
    pub downloadable: bool
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BookCreationParams {
    pub id: String,
    pub name: String,
    pub directory: String,
    pub elements: Vec<WizformElementModel>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WizformsCreationParams {
    pub book_id: String,
    pub wizforms: Vec<WizformDBModel>
}