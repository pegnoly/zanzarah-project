use std::{io::Write, sync::Arc};

use bmp::Pixel;
use reqwest::Client;
use rust_dropbox::client::DBXClient;
use serde::{Deserialize, Serialize};
use tokio::sync::{Mutex, RwLock};
use zz_data::core::text::Text;

use super::consts;

#[derive(Debug, Serialize, Deserialize)]
pub struct Config {
    pub existing_books: Vec<String>,
    pub current_book: String
}

pub struct AppManager {
    pub texts: Mutex<Vec<Text>>,
    pub config: Mutex<Config>,
    pub client: RwLock<Client>,
    pub dropbox: Arc<DropboxConnector>
}

impl AppManager {
    pub async fn new() -> Self {
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
                client: RwLock::new(Client::new()),
                dropbox: Arc::new(DropboxConnector::new())
            }
        }
        else {
            AppManager {
                texts: Mutex::default(),
                config: Mutex::new(serde_json::from_str(std::fs::read_to_string(&config_file).unwrap().as_str()).unwrap()),
                client: RwLock::new(Client::new()),
                dropbox: Arc::new(DropboxConnector::new())
            }
        }
    }
}

pub fn to_le_hex_string(i: i32) -> String {
    let bytes = i.to_le_bytes();
    format!("{:X}", i32::from_be_bytes(bytes))
}

#[derive(Serialize)]
pub struct PixelWrapper {
    pub r: u8,
    pub g: u8,
    pub b: u8
}

#[derive(Serialize)]
pub struct Icon {
    pub pixels: Vec<PixelWrapper>
}

impl Icon {
    pub fn new() -> Self {
        Icon {
            pixels: Vec::with_capacity(1600)
        }
    }

    pub fn app_pixel(&mut self, x: usize, y: usize, pixel: PixelWrapper) {
        self.pixels[(40 - y - 1) * 40 + x] = pixel;
    }
}

pub struct DropboxConnector {
    pub client: DBXClient
}

impl DropboxConnector {
    pub fn new() -> Self {
        DropboxConnector {
            client: DBXClient::new(consts::DROPBOX_TOKEN)
        }
    }
}