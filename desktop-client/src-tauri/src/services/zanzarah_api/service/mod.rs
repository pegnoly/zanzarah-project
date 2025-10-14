mod payloads;
pub mod prelude;

use cynic::{http::ReqwestExt, MutationBuilder, QueryBuilder};
use prelude::{ElementsPayload, FilterWizformsPayload, UpdateWizformPayload};
use reqwest::Client;
use tokio::sync::RwLock;
use uuid::Uuid;

use crate::{error::ZZParserError, services::prelude::{AllWizformsQuery, AllWizformsQueryVariables, BookAllLocationsQuery, BookAllLocationsQueryVariables, CreateBookMutation, CreateBookMutationArguments, CreateBookPayload, LocationEntriesBulkInsertMutation, LocationEntriesBulkInsertMutationArguments, LocationEntryInputModel, LocationWizformsBulkInsertResponse, WizformsMapLocation}};

use super::prelude::{BookFullModel, BooksQuery, BooksQueryArguments, ElementModel, ElementsQuery, ElementsQueryVariables, InsertWizformsResponse, UpdateWizformResponse, WizformEditableModel, WizformInputModel, WizformQuery, WizformQueryVariables, WizformSimpleModel, WizformUpdateMutation, WizformUpdateMutationArguments, WizformsBulkInsertMutation, WizformsBulkInsertMutationArguments, WizformsQuery, WizformsQueryVariables};

// const ZANZARAH_API_URL: &str = "https://zanzarah-project-api-lyaq.shuttle.app/";
const ZANZARAH_API_URL: &str = "http://127.0.0.1:8000/";

pub struct ZanzarahApiService {
    client: RwLock<Client>
}

impl ZanzarahApiService {
    pub fn new(client: Client) -> Self {
        ZanzarahApiService { client: RwLock::new(client) }
    }

    // pub async fn register_user(&self, payload: RegisterUserPayload) -> Result<RegisterUserResponse, ZZParserError> {
    //     let client = self.client.read().await;
    //     let mutation = RegisterUserMutation::build(RegisterUserMutationVariables::from(payload));
    //     let response = client.post(ZANZARAH_API_URL)
    //         .run_graphql(mutation)
    //         .await?;
    //     if let Some(data) = response.data {
    //         Ok(data.try_register_user)
    //     } else if let Some(errors) = response.errors {
    //         Err(ZZParserError::GraphQLErrorsArray { route: "Register user".to_string(), errors })
    //     } else {
    //         Err(ZZParserError::UnknownGraphQLError)
    //     }
    // }

    // pub async fn confirm_email(&self, payload: ConfirmEmailPayload) -> Result<EmailConfirmationResponse, ZZParserError> {
    //     let client = self.client.read().await;
    //     let mutation = ConfirmEmailMutation::build(ConfirmEmailMutationVariables::from(payload));
    //     let response = client.post(ZANZARAH_API_URL)
    //         .run_graphql(mutation)
    //         .await?;
    //     if let Some(data) = response.data {
    //         Ok(data.confirm_email)
    //     } else if let Some(errors) = response.errors {
    //         Err(ZZParserError::GraphQLErrorsArray { route: "Confirm email".to_string(), errors })
    //     } else {
    //         Err(ZZParserError::UnknownGraphQLError)
    //     }
    // }

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

    pub async fn create_book(&self, payload: CreateBookPayload) -> Result<Option<BookFullModel>, ZZParserError> {
        let client = self.client.read().await;
        let query = CreateBookMutation::build(CreateBookMutationArguments::from(payload));
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.create_book)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Create book".to_string(), errors })
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

    pub async fn get_all_wizforms(&self, book_id: Uuid) -> Result<Vec<WizformSimpleModel>, ZZParserError> {
        let client = self.client.read().await;
        let query = AllWizformsQuery::build(
            AllWizformsQueryVariables { book_id: book_id.into() }
        );
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.all_wizforms)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Get all wizforms".to_string(), errors })
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

    pub async fn update_wizform(&self, payload: UpdateWizformPayload) -> Result<UpdateWizformResponse, ZZParserError> {
        let client = self.client.read().await;
        let query = WizformUpdateMutation::build(
            WizformUpdateMutationArguments::from(payload)
        );
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.update_wizform)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Update wizform".to_string(), errors })
        } else {
            Err(ZZParserError::UnknownGraphQLError)
        }   
    }

    pub async fn get_all_locations(&self, book_id: Uuid) -> Result<Vec<WizformsMapLocation>, ZZParserError> {
        let client = self.client.read().await;
        let query = BookAllLocationsQuery::build(
            BookAllLocationsQueryVariables { book_id: book_id.into() }
        );
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.all_locations_for_book)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Get locations".to_string(), errors })
        } else {
            Err(ZZParserError::UnknownGraphQLError)
        } 
    }

    pub async fn location_entries_bulk_insert(&self, entries: Vec<LocationEntryInputModel>) -> Result<LocationWizformsBulkInsertResponse, ZZParserError> {
        let client = self.client.read().await;
        let query = LocationEntriesBulkInsertMutation::build(
            LocationEntriesBulkInsertMutationArguments { items: entries }
        );
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.insert_location_entries_bulk)
        } else if let Some(errors) = response.errors {
            Err(ZZParserError::GraphQLErrorsArray { route: "Insert entries bulk ".to_string(), errors })
        } else {
            Err(ZZParserError::UnknownGraphQLError)
        } 
    }
}