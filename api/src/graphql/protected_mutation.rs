use std::str::FromStr;

use async_graphql::Context;
use sea_orm::DatabaseConnection;
use uuid::Uuid;

use crate::{error::ZZApiError, services::book::repo::BookRepository};

use super::mutation::AddCollectionItemResponse;

#[derive(Default)]
pub struct ProtectedMutation;

#[async_graphql::Object]
impl ProtectedMutation {
    async fn add_collection_item(
        &self,
        context: &Context<'_>,
        collection_id: async_graphql::ID,
        wizform_id: async_graphql::ID
    ) -> Result<AddCollectionItemResponse, ZZApiError> {
        let service = context.data::<BookRepository>().map_err(|error| {
            tracing::error!(
                "Failed to get wizform service from context. {}",
                &error.message
            );
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!(
                "Failed to get database connection from context. {}",
                &error.message
            );
            ZZApiError::Empty
        })?;

        let insert_result = service.add_item_to_collection(db, Uuid::from_str(&collection_id)?, Uuid::from_str(&wizform_id)?).await?;
        Ok(AddCollectionItemResponse { created_id: insert_result.into() })
    }

    async fn remove_collection_item(
        &self,
        context: &Context<'_>,
        id: async_graphql::ID
    ) -> Result<String, ZZApiError> {
        let service = context.data::<BookRepository>().map_err(|error| {
            tracing::error!(
                "Failed to get wizform service from context. {}",
                &error.message
            );
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!(
                "Failed to get database connection from context. {}",
                &error.message
            );
            ZZApiError::Empty
        })?;

        service.remove_item_from_collection(db, Uuid::from_str(&id)?).await?;
        Ok("Wizform was removed from collection".to_string())
    }
}