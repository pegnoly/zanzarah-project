use async_graphql::Context;
use itertools::Itertools;
use sea_orm::DatabaseConnection;

use crate::{error::ZZApiError, services::book::{models::wizform::{WizformInputModel, WizformModel}, service::WizformService}};

pub struct Mutation;

#[derive(async_graphql::SimpleObject)]
pub struct InsertWizformsResponse {
    pub message: String
}

#[async_graphql::Object]
impl Mutation {
    async fn insert_wizforms_bulk(
        &self,
        context: &Context<'_>,
        wizforms: Vec<WizformInputModel>
    ) -> Result<InsertWizformsResponse, ZZApiError> {
        let service = context.data::<WizformService>().map_err(|error| {
            tracing::error!("Failed to get wizform service from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        let db = context.data::<DatabaseConnection>().map_err(|error| {
            tracing::error!("Failed to get database connection from context. {}", &error.message);
            ZZApiError::Empty
        })?;
        match service.insert_wizforms_bulk(db, wizforms.into_iter().filter_map(|m| if let Ok(w) = WizformModel::try_from(m) {
            Some(w)
        } else {
            None
        }).collect_vec()).await {
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
}