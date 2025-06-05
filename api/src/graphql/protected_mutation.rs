use std::str::FromStr;

use async_graphql::Context;
use sea_orm::DatabaseConnection;
use uuid::Uuid;

use crate::{error::ZZApiError, services::book::{models::{collection, wizform::WizformSelectionModel}, repo::BookRepository}};

use super::mutation::AddCollectionItemResponse;

#[derive(async_graphql::SimpleObject)]
pub struct CreateCollectionResponse {
    pub created_id: async_graphql::ID
}

#[derive(Default)]
pub struct ProtectedMutation;

#[async_graphql::Object]
impl ProtectedMutation {
    async fn create_collection(
        &self,
        context: &Context<'_>,
        user_id: async_graphql::ID,
        book_id: async_graphql::ID,
        name: String
    ) -> Result<collection::Model, ZZApiError> {
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

        let result = service.create_collection(db, Uuid::from_str(&user_id.0)?, Uuid::from_str(&book_id.0)?, name).await?;
        Ok(result)
    }

    async fn set_active_collection(
        &self,
        context: &Context<'_>,
        collection_id: async_graphql::ID
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

        service.set_active_collection(db, Uuid::from_str(&collection_id.0)?).await?;
        Ok("Collection now active".to_string())
    }

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

    async fn add_location_wizform(
        &self,
        context: &Context<'_>,
        location_id: async_graphql::ID,
        wizform_id: async_graphql::ID,
        comment: Option<String>
    ) -> Result<async_graphql::ID, ZZApiError> {
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

        let created_id = service.add_location_wizform(
            db, 
            Uuid::from_str(&location_id.0)?, 
            Uuid::from_str(&wizform_id.0)?, 
            comment
        ).await?;
        Ok(created_id.into())
    }

    async fn remove_location_wizform(
        &self,
        context: &Context<'_>,
        id: async_graphql::ID
    ) -> Result<Option<WizformSelectionModel>, ZZApiError> {
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
        let deleted = service.delete_location_wizform(db, Uuid::from_str(&id.0)?).await?;
        Ok(deleted)
    }

    async fn add_location_wizform_comment(
        &self,
        context: &Context<'_>,
        id: async_graphql::ID,
        comment: String
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
        service.add_location_wizform_comment(db, Uuid::from_str(&id.0)?, comment).await?;
        Ok("Comment added".to_string())
    }

    async fn remove_location_wizform_comment(
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
        service.remove_location_wizform_comment(db, Uuid::from_str(&id.0)?).await?;
        Ok("Comment removed".to_string())
    }

    async fn update_location_wizform_comment(
        &self,
        context: &Context<'_>,
        id: async_graphql::ID,
        comment: String
    ) -> Result<Option<String>, ZZApiError> {
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
        let update_result = service.update_location_wizform_comment(db, Uuid::from_str(&id.0)?, comment).await?;
        Ok(update_result)
    }
}