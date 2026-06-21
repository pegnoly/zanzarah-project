use serde::Serialize;
use crate::services::zanzarah_api::schema;

#[derive(Debug, cynic::QueryFragment, Serialize, Clone)]
#[cynic(graphql_type = "LocationModel")]
pub struct WizformsMapLocation {
    pub id: cynic::Id,
    pub section_id: cynic::Id,
    pub name: String,
    pub ordering: i32,
    pub game_number: Option<String>
}

#[derive(Debug, cynic::QueryVariables)]
pub struct BookAllLocationsQueryVariables {
    pub book_id: cynic::Id
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "QueryRoot", variables = "BookAllLocationsQueryVariables")]
pub struct BookAllLocationsQuery {
    #[arguments(bookId: $book_id)]
    pub all_locations_for_book: Vec<WizformsMapLocation>
}