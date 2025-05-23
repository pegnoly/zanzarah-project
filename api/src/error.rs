use std::num::ParseIntError;

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
    ParseInt(#[from] ParseIntError)
}
