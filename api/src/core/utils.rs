use jsonwebtoken::{DecodingKey, EncodingKey};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct StringPayload {
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StringOptionPayload {
    pub value: Option<String>,
}

#[derive(Clone)]
pub struct ApiManager {
    pub pool: sqlx::PgPool,
    pub encoding_key: EncodingKey,
    pub decoding_key: DecodingKey,
}
