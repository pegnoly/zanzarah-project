mod payloads;
pub mod prelude;

use cynic::{http::ReqwestExt, MutationBuilder, QueryBuilder};
use payloads::RegisterUserPayload;
use prelude::{ConfirmEmailPayload, ElementsPayload, FilterWizformsPayload};
use reqwest::Client;
use tokio::sync::RwLock;
use uuid::Uuid;

use crate::error::ZZParserError;

use super::prelude::{BookFullModel, BooksQuery, BooksQueryArguments, ConfirmEmailMutation, ConfirmEmailMutationVariables, ElementModel, ElementsQuery, ElementsQueryVariables, EmailConfirmationResponse, InsertWizformsResponse, RegisterUserMutation, RegisterUserMutationVariables, RegisterUserResponse, WizformEditableModel, WizformInputModel, WizformQuery, WizformQueryVariables, WizformSimpleModel, WizformsBulkInsertMutation, WizformsBulkInsertMutationArguments, WizformsQuery, WizformsQueryVariables};

const ZANZARAH_API_URL: &str = "https://zz-webapi-cv7m.shuttle.app/";

pub struct ZanzarahApiService {
    client: RwLock<Client>
}

impl ZanzarahApiService {
    pub fn new(client: Client) -> Self {
        ZanzarahApiService { client: RwLock::new(client) }
    }

    pub async fn register_user(&self, payload: RegisterUserPayload) -> Result<RegisterUserResponse, ZZParserError> {
        let client = self.client.read().await;
        let mutation = RegisterUserMutation::build(RegisterUserMutationVariables::from(payload));
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(mutation)
            .await?;
        if let Some(data) = response.data {
            Ok(data.try_register_user)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Register user".to_string(), errors })
        } else {
            Err(ZZParserError::UnknownGraphQLError)
        }
    }

    pub async fn confirm_email(&self, payload: ConfirmEmailPayload) -> Result<EmailConfirmationResponse, ZZParserError> {
        let client = self.client.read().await;
        let mutation = ConfirmEmailMutation::build(ConfirmEmailMutationVariables::from(payload));
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(mutation)
            .await?;
        if let Some(data) = response.data {
            Ok(data.confirm_email)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Confirm email".to_string(), errors })
        } else {
            Err(ZZParserError::UnknownGraphQLError)
        }
    }

    pub async fn get_books(&self) -> Result<Option<Vec<BookFullModel>>, ZZParserError> {
        let client = self.client.read().await;
        let query = BooksQuery::build(BooksQueryArguments { available: None });
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.books)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Get books".to_string(), errors })
        } else {
            Err(ZZParserError::UnknownGraphQLError)
        }
    }

    pub async fn upload_wizforms(&self, wizforms: Vec<WizformInputModel>) -> Result<InsertWizformsResponse, ZZParserError> {
        let client = self.client.read().await;
        let query = WizformsBulkInsertMutation::build(
            WizformsBulkInsertMutationArguments { wizforms }
        );
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.insert_wizforms_bulk)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Wizforms bulk insert".to_string(), errors })
        } else {
            Err(ZZParserError::UnknownGraphQLError)
        }
    }

    pub async fn get_wizforms(&self, payload: FilterWizformsPayload) -> Result<Vec<WizformSimpleModel>, ZZParserError> {
        let client = self.client.read().await;
        let query = WizformsQuery::build(
            WizformsQueryVariables::from(payload)
        );
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.wizforms)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Get wizforms".to_string(), errors })
        } else {
            Err(ZZParserError::UnknownGraphQLError)
        } 
    }

    pub async fn get_wizform(&self, id: Uuid) -> Result<Option<WizformEditableModel>, ZZParserError> {
        let client = self.client.read().await;
        let query = WizformQuery::build(
            WizformQueryVariables {id: id.into()}
        );
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.wizform)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Get wizform".to_string(), errors })
        } else {
            Err(ZZParserError::UnknownGraphQLError)
        } 
    }

    pub async fn load_elements(&self, payload: ElementsPayload) -> Result<Vec<ElementModel>, ZZParserError> {
        let client = self.client.read().await;
        let query = ElementsQuery::build(
            ElementsQueryVariables::from(payload)
        );
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.elements)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Get wizform".to_string(), errors })
        } else {
            Err(ZZParserError::UnknownGraphQLError)
        }         
    }
}