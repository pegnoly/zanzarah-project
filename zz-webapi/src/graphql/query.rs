use async_graphql::Context;
use sea_orm::DatabaseConnection;
use uuid::Uuid;

use crate::{error::ZZApiError, services::book::{models::{book::BookModel, element::ElementModel, wizform::{WizformElementType, WizformModel}}, service::WizformService}};

pub struct Query;

#[async_graphql::Object]
impl Query {
    async fn wizforms(
        &self,
        context: &Context<'_>,
        #[graphql(desc = "Book this wizform belongs to")]
        book_id: async_graphql::ID,
        #[graphql(desc = "Select all or only enabled wizforms")]
        enabled: Option<bool>,
        #[graphql(desc = "Optional element of wizform")]
        element_filter: Option<WizformElementType>,
        #[graphql(desc = "Optional name filter")]
        name_filter: Option<String>
    ) -> Result<Vec<WizformModel>, ZZApiError> {
        let service = context.data::<WizformService>().map_err(|error| {
            tracing::error!("Failed to get wizform service from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!("Failed to get database connection from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        match service.get_wizforms(Uuid::try_from(book_id.clone())?, enabled, element_filter, &name_filter, db).await {
            Ok(wizforms) => {
                Ok(wizforms)
            },
            Err(error) => {
                tracing::error!("
                    Failed to fetch wizforms. 
                    Params: book id - {:?}, enabled - {:?}, element: - {:?}, name filter - {:?}. 
                    Error message: {:?}", 
                    book_id, enabled, element_filter, name_filter, error
                );
                Err(error)
            }
        }
    }

    async fn wizform(
        &self,
        context: &Context<'_>,
        #[graphql(desc = "Id of wizform to focus")]
        id: async_graphql::ID
    ) -> Result<Option<WizformModel>, ZZApiError> {
        let service = context.data::<WizformService>().map_err(|error| {
            tracing::error!("Failed to get wizform service from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!("Failed to get database connection from context. {}", &error.message);
            ZZApiError::Empty
        })?;

        match service.get_wizform(Uuid::try_from(id.clone())?, db).await {
            Ok(wizform) => {
                Ok(wizform)
            },
            Err(error) => {
                tracing::error!("
                    Failed to fetch wizform. 
                    Params: id - {:?}. 
                    Error message: {:?}", 
                    id, error
                );
                Err(error)
            }
        }
    }

    async fn elements(
        &self,
        context: &Context<'_>,
        #[graphql(desc = "Book this element belongs to")]
        book_id: async_graphql::ID,
        #[graphql(desc = "Select all or only enabled elements")]
        enabled: Option<bool>
    ) -> Result<Vec<ElementModel>, ZZApiError> {
        let service = context.data::<WizformService>().map_err(|error| {
            tracing::error!("Failed to get wizform service from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!("Failed to get database connection from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        match service.get_elements(Uuid::try_from(book_id.clone())?, enabled, db).await {
            Ok(elements) => {
                Ok(elements)
            },
            Err(error) => {
                tracing::error!("
                    Failed to fetch elements for book. 
                    Params: id - {:?}, enabled - {:?}. 
                    Error message: {:?}", 
                    book_id, enabled, error
                );
                Err(error)
            }
        }
    }

    async fn books(
        &self,
        context: &Context<'_>,
        #[graphql(desc = "Query only available for user books")]
        available: Option<bool>
    ) -> Result<Vec<BookModel>, ZZApiError> {
        let service = context.data::<WizformService>().map_err(|error| {
            tracing::error!("Failed to get wizform service from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!("Failed to get database connection from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        let books = service.get_books(db, available).await;
        match books {
            Ok(books) => {
                Ok(books)
            },
            Err(error) => {
                Err(error)
            }
        }
    }
}