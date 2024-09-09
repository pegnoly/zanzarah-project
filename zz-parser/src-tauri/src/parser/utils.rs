use std::io::Write;

use reqwest::Client;
use serde::{Deserialize, Serialize};
use tokio::sync::{Mutex, RwLock};
use zz_data::core::text::Text;

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub existing_books: Vec<String>,
    pub current_book: String
}

pub struct AppManager {
    pub texts: Mutex<Vec<Text>>,
    pub config: Mutex<Config>,
    pub client: RwLock<Client>
}

impl AppManager {
    pub fn new() -> Self {
        let config_file = std::env::current_exe().unwrap().parent().unwrap().join("zz_cfg.json");
        if config_file.exists() == false {
            let mut file = std::fs::File::create(&config_file).unwrap();
            let config = Config { 
                existing_books: vec![], 
                current_book: String::new() 
            };
            let s = serde_json::to_string_pretty(&config).unwrap();
            file.write_all(&mut s.as_bytes()).unwrap();
            AppManager {
                texts: Mutex::default(),
                config: Mutex::new(config),
                client: RwLock::new(Client::new())
            }
        }
        else {
            AppManager {
                texts: Mutex::default(),
                config: Mutex::new(serde_json::from_str(std::fs::read_to_string(&config_file).unwrap().as_str()).unwrap()),
                client: RwLock::new(Client::new())
            }
        }
    }
}

pub fn to_le_hex_string(i: i32) -> String {
    let bytes = i.to_le_bytes();
    format!("{:X}", i32::from_be_bytes(bytes))
}