use serde::Serialize;

use crate::services::zanzarah_api::schema;
use super::wizform::WizformElementType;


#[derive(Debug, cynic::QueryFragment, Serialize, Clone)]
pub struct ElementModel {
    id: cynic::Id,
    name: String,
    element: WizformElementType,
    enabled: bool
}

#[derive(Debug, cynic::QueryVariables)]
pub struct ElementsQueryVariables {
    pub book_id: cynic::Id,
    pub enabled: Option<bool>
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "Query", variables = "ElementsQueryVariables")]
pub struct ElementsQuery {
    #[arguments(bookId: $book_id, enabled: $enabled)]
    pub elements: Vec<ElementModel>
}