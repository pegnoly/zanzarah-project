use serde::Serialize;

use super::wizform::WizformElementType;
use crate::services::zz_api::schema;

#[derive(Debug, cynic::QueryFragment, Serialize)]
pub struct ElementModel {
    pub id: cynic::Id,
    pub name: String,
    pub element: WizformElementType
}

#[derive(Debug, cynic::QueryVariables)]
pub struct ElementsQueryArguments {
    pub id: cynic::Id,
    pub enabled: Option<bool>
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "Query", variables = "ElementsQueryArguments")]
pub struct ElementsQuery {
    #[arguments(bookId: $id, enabled: $enabled)]
    pub elements: Option<Vec<ElementModel>>
}