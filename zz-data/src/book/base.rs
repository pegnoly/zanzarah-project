use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Book {
    pub id: String,
    pub name: String,
    pub initialized: bool,
    pub downloadadble: bool
}

#[derive(Debug, Deserialize)]
pub struct BookCreationParams {
    pub id: String,
    pub name: String
}