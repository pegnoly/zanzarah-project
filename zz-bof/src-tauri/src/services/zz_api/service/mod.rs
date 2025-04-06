mod payloads;
pub mod prelude;

use cynic::{http::ReqwestExt, QueryBuilder};
use payloads::*;
use reqwest::Client;
use tokio::sync::RwLock;

use crate::error::ZZBookError;

use super::prelude::*;

const ZANZARAH_API_URL: &str = "https://zz-webapi-cv7m.shuttle.app/";

pub struct ZanzarahApiService {
    client: RwLock<Client>
}

impl ZanzarahApiService {
    pub fn new(client: Client) -> Self {
        ZanzarahApiService { client: RwLock::new(client) }
    }

    pub async fn get_books(&self, payload: GetBooks) -> Result<Option<Vec<BookModel>>, ZZBookError> {
        let client = self.client.read().await;
        let query = BooksQuery::build(BooksQueryArguments::from(payload));
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.books)
        } else if let Some(errors) = response.errors {
            Err(ZZBookError::GraphQLErrorsArray {route: "Get books".to_string(), errors})
        } else {
            Err(ZZBookError::UnknownGraphQLError)
        }
    }

    pub async fn get_elements(&self, payload: GetElements) -> Result<Option<Vec<ElementModel>>, ZZBookError> {
        let client = self.client.read().await;
        let query = ElementsQuery::build(ElementsQueryArguments::from(payload));
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.elements)
        } else if let Some(errors) = response.errors {
            Err(ZZBookError::GraphQLErrorsArray {route: "Get elements".to_string(), errors})
        } else {
            Err(ZZBookError::UnknownGraphQLError)
        }
    }

    pub async fn get_wizforms_list(&self, payload: GetWizformsList) -> Result<Option<Vec<WizformListModel>>, ZZBookError> {
        let client = self.client.read().await;
        let query = WizformListQuery::build(WizformListArguments::from(payload));
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.wizforms)
        } else if let Some(errors) = response.errors {
            Err(ZZBookError::GraphQLErrorsArray {route: "Get wizforms list".to_string(), errors})
        } else {
            Err(ZZBookError::UnknownGraphQLError)
        }
    }

    pub async fn get_wizform_focused(&self, payload: GetWizformFocused) -> Result<Option<WizformFocused>, ZZBookError> {
        let client = self.client.read().await;
        let query = WizformFocusedQuery::build(WizformFocusedQueryArguments::from(payload));
        let response = client.post(ZANZARAH_API_URL)
            .run_graphql(query)
            .await?;
        if let Some(data) = response.data {
            Ok(data.wizform)
        } else if let Some(errors) = response.errors {
            Err(ZZBookError::GraphQLErrorsArray {route: "Get wizform focused".to_string(), errors})
        } else {
            Err(ZZBookError::UnknownGraphQLError)
        }
    }
}