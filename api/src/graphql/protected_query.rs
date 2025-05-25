use std::str::FromStr;

use async_graphql::Context;
use sea_orm::DatabaseConnection;
use uuid::Uuid;

use crate::{error::ZZApiError, services::book::{models::collection::CollectionModel, repo::BookRepository}};

#[derive(Default)]
pub struct ProtectedQuery;

#[async_graphql::Object]
impl ProtectedQuery {
    async fn collections(
        &self,
        context: &Context<'_>,
        user_id: async_graphql::ID,
        book_id: async_graphql::ID,
    ) -> Result<Vec<CollectionModel>, ZZApiError> {
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
        let collections = service.get_collections_for_user(db, user_id.parse::<i32>()?, Uuid::from_str(&book_id)?).await;
        match collections {
            Ok(collections) => {
                Ok(collections)
            },
            Err(error) => {
                Err(error)
            }
        }
    }
}