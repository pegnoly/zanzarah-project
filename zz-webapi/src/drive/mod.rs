use std::{io::{BufReader, Bytes, Cursor, Read}, sync::Arc};

use axum::{extract::{Multipart, State}, http::StatusCode, response::IntoResponse};
use rust_dropbox::client::DBXClient;
use shuttle_runtime::SecretStore;

use crate::core::utils::ApiManager;
pub struct DropboxConnector {
    pub client: DBXClient
}

impl DropboxConnector {
    pub fn new(secrets: &SecretStore) -> Self {
        DropboxConnector {
            client: DBXClient::new("sl.B8yGESI-exB9lFapveMbiv_g4eIDRN-Zd3r-g8kEaDt2dwt24pMNBsLkTvl0PffVk9Yke77hduKWY2UEaQBrw4f9VfBukIhOALfEOfN2iSCtkUCx3Dgz_BecOCAHspdU3a3gCB9xNVCNA2OhD3m4DlQ")
        }
    }
}

pub async fn get_file(
    State(api_manager): State<ApiManager>,
    //mut multipart: Multipart
) -> impl IntoResponse {
    //tracing::info!("We are in upload function");
    let dropbox = api_manager.drive.clone();
    let result = dropbox.client.download("/patch.txt");
    match result {
        Ok(success) => {
            tracing::info!("Downloaded successfully");
        },
        Err(failure) => {
            tracing::info!("Download error: {:?}", failure);
        }
    }
    // while let Some(mut field) = multipart.next_field().await.unwrap() {
    //     let name = field.name().unwrap().to_string();
    //     let data = field.bytes().await.unwrap();
    //     if name == "img" {
    //         let cursor = Cursor::new(data);
    //         let mut file = File::default();
    //         file.name = Some("test.bmp".to_string());
    //         //file.parents = Some(vec!["1nUbevQeqlfhqxzw7qpwUII_5uT3RA75b".to_string()]);
    //         let upload_result = hub_cloned.files()
    //             .create(file)
    //             .supports_all_drives(true)
    //             .ignore_default_visibility(false)
    //             .upload(cursor, "image/bmp".parse().unwrap())
    //             .await;
    //         match upload_result {
    //             Ok(result_ok) => {
    //                 tracing::info!("File uploaded to drive!");
    //                 tracing::info!("File info: {:?}", &result_ok.1);
    //             },
    //             Err(result_fail) => {
    //                 tracing::info!("Error uploading file to drive: {}", result_fail.to_string());
    //             }
    //         }
    //     }
    //     tracing::info!("Name of field is {}", &name);
    // } 
    (StatusCode::OK, "Ok".to_string())
}