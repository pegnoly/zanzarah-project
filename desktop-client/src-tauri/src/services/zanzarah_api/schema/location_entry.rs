use serde::Serialize;
use uuid::Uuid;
use crate::services::zanzarah_api::schema;

#[derive(Debug, cynic::InputObject, Clone)]
#[cynic(graphql_type = "LocationWizformInputModel")]
pub struct LocationEntryInputModel {
    pub location_id: cynic::Id,
    pub wizform_id: cynic::Id
}

#[derive(Debug, cynic::QueryVariables)]
pub struct LocationEntriesBulkInsertMutationArguments {
    pub items: Vec<LocationEntryInputModel>
}

#[derive(Debug, cynic::QueryFragment)]
pub struct LocationWizformsBulkInsertResponse {
    pub message: String
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "MutationRoot", variables = "LocationEntriesBulkInsertMutationArguments")]
pub struct LocationEntriesBulkInsertMutation {
    #[arguments(entries: $items)]
    pub insert_location_entries_bulk: LocationWizformsBulkInsertResponse
}