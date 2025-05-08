use cynic::{QueryFragment, QueryVariables};

use crate::services::zanzarah_api::schema;

#[derive(Debug, Clone, QueryFragment)]
#[cynic(graphql_type="BookModel")]
pub struct BookFullModel {
    pub id: cynic::Id,
    pub name: String,
    pub directory: String,
    pub initialized: bool,
    pub available: bool,
    pub major_version: i32,
    pub minor_version: i32,
    pub patch_version: i32
}

#[derive(Debug, QueryVariables)]
pub struct BooksQueryArguments {
    pub available: Option<bool>
}

#[derive(Debug, QueryFragment)]
#[cynic(graphql_type="Query", variables="BooksQueryArguments")]
pub struct BooksQuery {
    #[arguments(available: $available)]
    pub books: Option<Vec<BookFullModel>>
}