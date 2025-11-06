use crate::services::zanzarah_api::schema;

#[derive(Debug, cynic::InputObject, Clone)]
#[cynic(graphql_type = "EvolutionListItem")]
pub struct EvolutionListItem {
    pub from: i32,
    pub to: i32
}

#[derive(Debug, cynic::InputObject, Clone)]
#[cynic(graphql_type = "EvolutionsList")]
pub struct EvolutionsList {
    pub items: Vec<EvolutionListItem>
}

#[derive(Debug, cynic::InputObject, Clone)]
#[cynic(graphql_type = "ItemInputModel")]
pub struct ItemInputModel {
    pub book_id: cynic::Id,
    pub name: String,
    pub icon64: String,
    pub evolutions: EvolutionsList
}

#[derive(Debug, cynic::QueryVariables)]
pub struct ItemsBulkInsertMutationVariables {
    pub items: Vec<ItemInputModel>
}

#[derive(Debug, cynic::QueryFragment)]
pub struct ItemsBulkInsertResponse {
    pub message: String
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "MutationRoot", variables = "ItemsBulkInsertMutationVariables")]
pub struct ItemsBulkInsertMutation {
    #[arguments(items: $items)]
    pub insert_items_bulk: ItemsBulkInsertResponse
}