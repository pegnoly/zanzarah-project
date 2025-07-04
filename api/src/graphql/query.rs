use std::str::FromStr;

use async_graphql::Context;
use sea_orm::DatabaseConnection;
use uuid::Uuid;

use crate::{
    error::ZZApiError,
    services::{
        auth::{
            prelude::{AuthRepository, UserModel},
            utils::{AuthorizationResult, SignInResult},
        },
        book::{
            models::{
                book::{BookFullModel, BookModel},
                element::ElementModel,
                location::{LocationNameModel, LocationWithEntriesCountModel},
                location_section::LocationSectionWithCount,
                location_wizform_entry::LocationWizformFullEntry,
                wizform::{CollectionWizform, WizformElementType, WizformSelectionModel},
            },
            repo::BookRepository,
        },
    },
};

#[derive(Default)]
pub struct Query;

#[async_graphql::Object]
impl Query {
    async fn user_by_email(
        &self,
        context: &Context<'_>,
        email: String,
    ) -> Result<Option<UserModel>, ZZApiError> {
        let repo = context.data::<AuthRepository>().map_err(|error| {
            tracing::error!(
                "Failed to get auth repository from context. {}",
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

        match repo.get_user_by_email(db, email.clone()).await {
            Ok(user) => Ok(user),
            Err(error) => {
                tracing::error!(
                    "
                    Failed to get user by email. 
                    Params: email - {:?}. 
                    Error message: {:?}",
                    email,
                    error
                );
                Err(error)
            }
        }
    }

    async fn wizforms(
        &self,
        context: &Context<'_>,
        #[graphql(desc = "Book this wizform belongs to")] book_id: async_graphql::ID,
        #[graphql(desc = "Select all or only enabled wizforms")] enabled: Option<bool>,
        #[graphql(desc = "Optional element of wizform")] element_filter: Option<WizformElementType>,
        #[graphql(desc = "Optional name filter")] name_filter: Option<String>,
        #[graphql(desc = "Optional active collection")] collection: Option<Uuid>,
    ) -> Result<Vec<CollectionWizform>, ZZApiError> {
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
        match service
            .get_wizforms(
                Uuid::try_from(book_id.clone())?,
                enabled,
                element_filter,
                name_filter,
                collection,
                db,
            )
            .await
        {
            Ok(wizforms) => Ok(wizforms),
            Err(error) => {
                // tracing::error!(
                //     "
                //     Failed to fetch wizforms.
                //     Params: book id - {:?}, enabled - {:?}, element: - {:?}, name filter - {:?}.
                //     Error message: {:?}",
                //     book_id,
                //     enabled,
                //     element_filter,
                //     name_filter,
                //     error
                // );
                Err(error)
            }
        }
    }

    async fn wizform(
        &self,
        context: &Context<'_>,
        #[graphql(desc = "Id of wizform to focus")] id: async_graphql::ID,
        #[graphql(desc = "Optional current collection")] collection_id: Option<async_graphql::ID>,
    ) -> Result<Option<CollectionWizform>, ZZApiError> {
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

        match service
            .get_wizform(
                Uuid::try_from(id.clone())?,
                if let Some(collection) = collection_id {
                    Some(Uuid::from_str(&collection.0)?)
                } else {
                    None
                },
                db,
            )
            .await
        {
            Ok(wizform) => Ok(wizform),
            Err(error) => {
                tracing::error!(
                    "
                    Failed to fetch wizform. 
                    Params: id - {:?}. 
                    Error message: {:?}",
                    id,
                    error
                );
                Err(error)
            }
        }
    }

    async fn elements(
        &self,
        context: &Context<'_>,
        #[graphql(desc = "Book this element belongs to")] book_id: async_graphql::ID,
        #[graphql(desc = "Select all or only enabled elements")] enabled: Option<bool>,
    ) -> Result<Vec<ElementModel>, ZZApiError> {
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
        match service
            .get_elements(Uuid::try_from(book_id.clone())?, enabled, db)
            .await
        {
            Ok(elements) => Ok(elements),
            Err(error) => {
                tracing::error!(
                    "
                    Failed to fetch elements for book. 
                    Params: id - {:?}, enabled - {:?}. 
                    Error message: {:?}",
                    book_id,
                    enabled,
                    error
                );
                Err(error)
            }
        }
    }

    async fn books(
        &self,
        context: &Context<'_>,
        #[graphql(desc = "Query only available for user books")] available: Option<bool>,
    ) -> Result<Vec<BookModel>, ZZApiError> {
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
        let books = service.get_books(db, available).await;
        match books {
            Ok(books) => Ok(books),
            Err(error) => Err(error),
        }
    }

    async fn current_book(
        &self,
        context: &Context<'_>,
        id: async_graphql::ID,
    ) -> Result<Option<BookFullModel>, ZZApiError> {
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
        let book = service.get_current_book(db, Uuid::from_str(&id.0)?).await;
        match book {
            Ok(book) => Ok(book),
            Err(error) => Err(error),
        }
    }

    async fn process_token(
        &self,
        context: &Context<'_>,
        token: String,
    ) -> Result<AuthorizationResult, ZZApiError> {
        let service = context.data::<AuthRepository>().map_err(|error| {
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
        let result = service.get_user_data_from_token(db, token).await?;
        Ok(result)
    }

    async fn sign_in(
        &self,
        context: &Context<'_>,
        email: String,
        password: String,
    ) -> Result<SignInResult, ZZApiError> {
        let service = context.data::<AuthRepository>().map_err(|error| {
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

        let result = service.sign_in(db, email, password).await?;
        Ok(result)
    }

    async fn sections(
        &self,
        context: &Context<'_>,
        book_id: async_graphql::ID,
    ) -> Result<Vec<LocationSectionWithCount>, ZZApiError> {
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

        let result = service
            .get_locations_sections(db, Uuid::from_str(&book_id.0)?)
            .await?;
        Ok(result)
    }

    async fn locations(
        &self,
        context: &Context<'_>,
        section_id: async_graphql::ID,
    ) -> Result<Vec<LocationWithEntriesCountModel>, ZZApiError> {
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

        let result = service
            .get_locations(db, Uuid::from_str(&section_id.0)?)
            .await?;
        Ok(result)
    }

    async fn location_entries(
        &self,
        context: &Context<'_>,
        location_id: async_graphql::ID,
    ) -> Result<Vec<LocationWizformFullEntry>, ZZApiError> {
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

        let result = service
            .get_location_wizforms(db, Uuid::from_str(&location_id.0)?)
            .await?;
        Ok(result)
    }

    async fn selectable_wizforms(
        &self,
        context: &Context<'_>,
        book_id: async_graphql::ID,
        location_id: async_graphql::ID,
    ) -> Result<Vec<WizformSelectionModel>, ZZApiError> {
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

        let result = service
            .get_wizforms_for_selection(
                db,
                Uuid::from_str(&book_id.0)?,
                Uuid::from_str(&location_id.0)?,
            )
            .await?;
        Ok(result)
    }

    async fn wizform_habitats(
        &self,
        context: &Context<'_>,
        wizform_id: async_graphql::ID,
    ) -> Result<Vec<LocationNameModel>, ZZApiError> {
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

        let result = service
            .get_wizform_habitats(db, Uuid::from_str(&wizform_id.0)?)
            .await?;
        Ok(result)
    }
}
