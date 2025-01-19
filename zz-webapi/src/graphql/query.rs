use async_graphql::Context;
use sea_orm::DatabaseConnection;
use uuid::Uuid;

use crate::services::wizform::{models::{element::{self, ElementModel}, wizform::{self, WizformElementType, WizformModel}}, service::WizformService};

pub struct Query;

#[async_graphql::Object]
impl Query {
    async fn wizforms<'a>(
        &self,
        context: &Context<'a>,
        #[graphql(desc = "Book this wizform belongs to")]
        book_id: Uuid,
        #[graphql(desc = "Select all or only enabled wizforms")]
        enabled: Option<bool>,
        #[graphql(desc = "Optional element of wizform")]
        element_filter: Option<WizformElementType>,
        #[graphql(desc = "Optional name filter")]
        name_filter: Option<String>
    ) -> Result<Option<Vec<WizformModel>>, String> {
        let service = context.data::<WizformService>().unwrap();
        let db = context.data::<DatabaseConnection>().unwrap();
        let wizforms = service.get_wizforms(book_id, enabled, element_filter, name_filter, db).await;
        match wizforms {
            Ok(wizforms) => {
                Ok(wizforms)
            },
            Err(error) => {
                Err(error)
            }
        }
    }

    async fn elements<'a>(
        &self,
        context: &Context<'a>,
        #[graphql(desc = "Book this element belongs to")]
        book_id: Uuid,
        #[graphql(desc = "Select all or only enabled elements")]
        enabled: Option<bool>
    ) -> Result<Option<Vec<ElementModel>>, String> {
        let service = context.data::<WizformService>().unwrap();
        let db = context.data::<DatabaseConnection>().unwrap();
        let elements = service.get_elements(book_id, enabled, db).await;
        match elements {
            Ok(elements) => {
                Ok(elements)
            },
            Err(error) => {
                Err(error)
            }
        }
    }
}