use serde::{Deserialize, Serialize};
use strum::EnumIter;

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
    pub elements: Vec<WizformElementModel>,
    pub filters: Vec<WizformFilterDBModel>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WizformsCreationParams {
    pub book_id: String,
    pub wizforms: Vec<WizformDBModel>
}

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::Type, EnumIter)]
#[repr(i32)]
pub enum WizformFilterType {
    NoFilter,
    CustomFilter1,
    CustomFilter2,
    CustomFilter3,
    CustomFilter4,
    CustomFilter5,
    CustomFilter6,
    CustomFilter7,
    CustomFilter8,
    CustomFilter9,
    CustomFilter10
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct WizformFilterDBModel {
    pub id: String,
    pub book_id: String,
    pub name: String,
    pub filter_type: i32,
    pub enabled: bool 
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct WizformSpawnPointDBModel {
    pub id: String,
    pub book_id: String,
    pub name: String,
    pub point_type: i32
}