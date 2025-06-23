use std::num::ParseIntError;

use serde::Serialize;

#[derive(Debug, thiserror::Error)]
pub enum ZZApiError {
    #[error(transparent)]
    SeaOrmError(#[from] sea_orm::DbErr),
    #[error(transparent)]
    UUIDError(#[from] uuid::Error),
    #[error("Some already traced error")]
    Empty,
    #[error("Failed to setup shuttle runtime")]
    ShuttleRuntime(#[from] shuttle_runtime::Error),
    #[error(transparent)]
    Reqwest(#[from] reqwest::Error),
    #[error("Custom ZZApi error: `{0}`")]
    Custom(String),
    #[error(transparent)]
    ParseInt(#[from] ParseIntError),
    #[error(transparent)]
    Jwt(#[from] jsonwebtoken::errors::Error),
    #[error("Failed to generate hash: {0:?}")]
    Argon2Hash(argon2::password_hash::Error),
    #[error(transparent)]
    Totp(#[from] totp_rs::TotpUrlError),
    #[error("IncorrectEmail")]
    IncorrectEmail,
    #[error("IncorrectPassword")]
    IncorrectPassword,
    #[error("EmailAlreadyExists")]
    EmailAlreadyExists,
    #[error("IncorrectCode")]
    IncorrectCode,
    #[error("CodeAlreadyUsed")]
    CodeAlreadyUsed,
    #[error("UserAlreadyConfirmed")]
    UserAlreadyConfirmed,
}

impl From<argon2::password_hash::Error> for ZZApiError {
    fn from(value: argon2::password_hash::Error) -> Self {
        ZZApiError::Argon2Hash(value)
    }
}

impl Serialize for ZZApiError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}
