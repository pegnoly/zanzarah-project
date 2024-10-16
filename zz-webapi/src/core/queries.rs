use serde::{Deserialize, Serialize};
use uuid::Uuid;
use zz_data::core::wizform::WizformElementType;

#[derive(Debug, Serialize, Deserialize)]
pub struct WizformUpdateQuery {
    pub enabled: Option<bool>,
    pub element: Option<i16>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BookCreationQuery {
    pub id: Uuid,
    pub name: String,
    pub directory: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DefaultFetchQuery {
    pub id: Uuid
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ElementUpdateQuery {
    pub id: Uuid,
    pub name: String,
    pub enabled: bool
}