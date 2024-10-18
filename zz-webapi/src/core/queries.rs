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

#[derive(Debug, Serialize, Deserialize)]
pub struct WizformFilterQuery {
    pub element: i16,
    pub name: String
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct WizformFilteredModel {
    pub id: Uuid,
    pub cleared_name: String,
    pub icon: String,
    pub number: i16
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct ClearedName(pub String);