mod payloads;
pub mod prelude;

use cynic::{http::ReqwestExt, MutationBuilder};
use reqwest::Client;
use tokio::sync::RwLock;

use crate::error::ZZParserError;

use super::prelude::{InsertWizformsResponse, WizformInputModel, WizformsBulkInsertMutation, WizformsBulkInsertMutationArguments};

const ZANZARAH_API_URL: &str = "https://zz-webapi-cv7m.shuttle.app/";

pub struct ZanzarahApiService {
    client: RwLock<Client>
}

impl ZanzarahApiService {
    pub fn new(client: Client) -> Self {
        ZanzarahApiService { client: RwLock::new(client) }
    }

    pub async  fn upload_wizforms(&self, wizforms: Vec<WizformInputModel>) -> Result<InsertWizformsResponse, ZZParserError> {
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
}