#[derive(Debug, thiserror::Error)]
pub enum ZZApiError {
    #[error(transparent)]
    SeaOrmError(#[from]sea_orm::DbErr),
    #[error(transparent)]
    UUIDError(#[from]uuid::Error),
    #[error("Some already traced error")]
    Empty
}