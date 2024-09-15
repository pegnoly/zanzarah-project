use std::sync::Arc;

use serde::{Deserialize, Serialize};

use crate::drive::DropboxConnector;

#[derive(Debug, Serialize, Deserialize)]
pub struct StringPayload {
    pub value: String
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StringOptionPayload {
    pub value: Option<String>
}

#[derive(Clone)]
pub struct ApiManager {
    pub pool: sqlx::PgPool,
    pub drive: Arc<DropboxConnector>
}
