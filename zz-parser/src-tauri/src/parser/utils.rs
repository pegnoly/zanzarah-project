use std::{collections::HashMap, io::Write, path::PathBuf};

use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::value::RawValue;
use tokio::sync::{Mutex, RwLock};
use uuid::{uuid, Uuid};
use zz_data::core::text::Text;

use super::plugins::types::{DescPluginType, NamePlugin, NamePluginType};

#[derive(Debug, Serialize, Deserialize)]
pub struct BookConfig {
    pub books_data: HashMap<Uuid, BookConfigSchema>
}

impl Config {
    pub fn load(path: PathBuf) -> Option<Self> {
        let books_data_string = std::fs::read_to_string(path).unwrap();
        let books_config: Result<Config, serde_json::Error> = serde_json::from_str(&books_data_string);
        match books_config {
            Ok(books_config) => {
                println!("Books config: {:?}", &books_config);
                Some(books_config)
            },
            Err(json_error) => {
                println!("Error deserializing config: {}", json_error.to_string());
                None
            }
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub books_data: HashMap<Uuid, BookConfigSchema>,
    pub current_book: Uuid
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NamePluginConfigSchema {
    pub plugin_type: NamePluginType,
    //#[serde(borrow)]
    pub data: Box<RawValue>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DescPluginConfigSchema {
    pub plugin_type: DescPluginType,
    pub data: Box<RawValue>
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BookConfigSchema {
    pub directory: String,
    pub name_plugins: Vec<NamePluginConfigSchema>,
    pub desc_plugins: Vec<DescPluginConfigSchema>
}



pub struct AppManager {
    pub texts: Mutex<Vec<Text>>,
    pub config: Mutex<Option<Config>>,
    pub client: RwLock<Client>
}

impl AppManager {
    pub async fn new() -> Self {
        let config_file = std::env::current_exe().unwrap().parent().unwrap().join("zz_cfg.json");
        if config_file.exists() == false {
            let mut file = std::fs::File::create(&config_file).unwrap();
            let config = Config { 
                books_data: HashMap::new(),
                current_book: uuid!("5a5247c2-273b-41e9-8224-491e02f77d8d")
            };
            // let s = serde_json::to_string_pretty(&config).unwrap();
            // file.write_all(&mut s.as_bytes()).unwrap();
            AppManager {
                texts: Mutex::default(),
                config: Mutex::new(Some(config)),
                client: RwLock::new(Client::new())
            }
        }
        else {
            AppManager {
                texts: Mutex::default(),
                config: Mutex::new(Config::load(config_file)),
                client: RwLock::new(Client::new())
            }
        }
    }
}

pub fn to_le_hex_string(i: i32) -> String {
    let bytes = i.to_le_bytes();
    format!("{:X}", i32::from_be_bytes(bytes))
}