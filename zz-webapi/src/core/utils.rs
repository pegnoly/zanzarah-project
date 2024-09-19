use std::sync::Arc;

use serde::{Deserialize, Serialize};

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
    pub dropbox_token: String
}
