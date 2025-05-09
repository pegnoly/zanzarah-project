use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use serde_json::value::RawValue;
use uuid::Uuid;

use crate::services::prelude::{DescPluginType, NamePluginType};

#[derive(Debug, Serialize, Deserialize)]
pub struct AppConfig {
    pub books_data: HashMap<Uuid, BookConfigSchema>,
    pub current_book: Uuid
}

// #[derive(Debug, Serialize, Deserialize)]
// pub struct NamePluginConfigSchema {
//     pub plugin_type: NamePluginType,

//     pub data: Box<RawValue>
// }

// #[derive(Debug, Serialize, Deserialize)]
// pub struct DescPluginConfigSchema {
//     pub plugin_type: DescPluginType,
//     pub data: Box<RawValue>
// }

#[derive(Debug, Serialize, Deserialize)]
pub struct BookConfigSchema {
    pub directory: String,
    pub name_plugins: Vec<NamePluginType>,
    pub desc_plugins: Vec<DescPluginType>
}