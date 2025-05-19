use async_graphql::Context;
use itertools::Itertools;
use sea_orm::DatabaseConnection;

use crate::{error::ZZApiError, services::{auth::prelude::AuthRepository, book::{models::wizform::{WizformInputModel, WizformModel, WizformUpdateModel}, repo::BookRepository}}};

pub struct Mutation;

#[derive(async_graphql::SimpleObject)]
pub struct InsertWizformsResponse {
    pub message: String
}

#[derive(async_graphql::SimpleObject)]
pub struct RegisterUserResponse {
    pub message: String
}

#[derive(async_graphql::SimpleObject)]
pub struct EmailConfirmationResponse {
    pub message: String
}

#[derive(async_graphql::SimpleObject)]
pub struct UpdateWizformResponse {
    pub message: String
}

#[async_graphql::Object]
impl Mutation {
    async fn insert_wizforms_bulk(
        &self,
        context: &Context<'_>,
        wizforms: Vec<WizformInputModel>
    ) -> Result<InsertWizformsResponse, ZZApiError> {
        let service = context.data::<BookRepository>().map_err(|error| {
            tracing::error!("Failed to get wizform service from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!("Failed to get database connection from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        match service.insert_wizforms_bulk(db, wizforms.into_iter().filter_map(|m| WizformModel::try_from(m).ok()).collect_vec()).await {
            Ok(()) => {
                Ok(InsertWizformsResponse { message: "Wizforms inserted successfully".to_string() })
            },
            Err(error) => {
                tracing::error!("
                    Failed to insert wizforms.
                    Error: {:#?}
                ", &error);
                Err(error)
            }
        }
    }

    async fn try_register_user(
        &self,
        context: &Context<'_>,
        email: String,
        password: String
    ) -> Result<RegisterUserResponse, ZZApiError> {
        let repo = context.data::<AuthRepository>().map_err(|error| {
            tracing::error!("Failed to get auth repo from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!("Failed to get database connection from context. {}", &error.message);
            ZZApiError::Empty
        })?;

        let error_params = format!("
            Failed to register user.
            Params: email: {:#?}, password: {:#?}.
        ", &email, &password);

        match repo.register_user(db, email, password).await {
            Ok(()) => {
                Ok(RegisterUserResponse { message: "User successfully registered".to_string() })
            },
            Err(error) => {
                tracing::info!("{}. Error: {:#?}.", &error_params, &error);
                Err(error)
            }
        }
    }

    async fn confirm_email(
        &self,
        context: &Context<'_>,
        email: String,
        code: String
    ) -> Result<EmailConfirmationResponse, ZZApiError> {
        let repo = context.data::<AuthRepository>().map_err(|error| {
            tracing::error!("Failed to get auth repo from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!("Failed to get database connection from context. {}", &error.message);
            ZZApiError::Empty
        })?;

        let error_params = format!("
            Failed to confirm email.
            Params: email: {:#?}, confirmation code: {:#?}.
        ", &email, &code);

        match repo.confirm_email(db, email, code).await {
            Ok(()) => {
                Ok(EmailConfirmationResponse { message: "Email successfully confirmed".to_string() })
            },
            Err(error) => {
                tracing::info!("{}. Error: {:#?}.", &error_params, &error);
                Err(error)
            }
        }
    }

    async fn update_wizform(
        &self,
        context: &Context<'_>,
        update_model: WizformUpdateModel,
    ) -> Result<UpdateWizformResponse, ZZApiError> {
        let service = context.data::<BookRepository>().map_err(|error| {
            tracing::error!("Failed to get wizform service from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!("Failed to get database connection from context. {}", &error.message);
            ZZApiError::Empty
        })?;

        let error_params = format!("
            Failed to update wizforms.
            Params: update model: {:#?}
        ", &update_model);

        let success_message = format!("Wizform {:?} updated successfully", &update_model.id);

        match service.update_wizform(db, update_model).await {
            Ok(()) => {
                Ok(UpdateWizformResponse { message: success_message })
            },
            Err(error) => {
                tracing::info!("{}. Error: {:#?}.", &error_params, &error);
                Err(error)
            }
        }
    }
}