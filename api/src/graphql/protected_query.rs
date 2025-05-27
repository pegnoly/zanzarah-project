use std::str::FromStr;

use async_graphql::Context;
use sea_orm::DatabaseConnection;
use uuid::Uuid;

use crate::{error::ZZApiError, services::book::{models::collection::{CollectionFullModel, CollectionModel}, repo::BookRepository}};

#[derive(Default)]
pub struct ProtectedQuery;

#[async_graphql::Object]
impl ProtectedQuery {
    async fn collections(
        &self,
        context: &Context<'_>,
        user_id: async_graphql::ID,
        book_id: async_graphql::ID,
    ) -> Result<Vec<CollectionFullModel>, ZZApiError> {
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
        let collections = service.get_collections_for_user(db, Uuid::from_str(&user_id.0)?, Uuid::from_str(&book_id)?).await;
        match collections {
            Ok(collections) => {
                Ok(collections)
            },
            Err(error) => {
                Err(error)
            }
        }
    }

    async fn active_collection(
        &self,
        context: &Context<'_>,
        book_id: async_graphql::ID,
        user_id: async_graphql::ID
    ) -> Result<Option<async_graphql::ID>, ZZApiError> {
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
        if let Some(collection_id) = service.get_active_collection_for_user(db, Uuid::from_str(&user_id.0)?, Uuid::from_str(&book_id.0)?).await? {
            Ok(Some(collection_id.into()))
        } else {
            Ok(None)
        }
    }

    async fn entries_count(
        &self,
        context: &Context<'_>,
        collection_id: async_graphql::ID
    ) -> Result<u64, ZZApiError> {
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

        let count = service.get_entries_count(db, Uuid::from_str(&collection_id.0)?).await?;
        Ok(count)
    }
}