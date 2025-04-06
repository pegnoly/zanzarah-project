use serde::Serialize;

use crate::services::zz_api::schema;

#[derive(Debug, cynic::QueryFragment, Serialize)]
pub struct BookModel {
    pub id: cynic::Id,
    pub name: String
}

#[derive(cynic::QueryVariables)]
pub struct BooksQueryArguments {
    pub available: Option<bool>
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "Query", variables = "BooksQueryArguments")]
pub struct BooksQuery {
    #[arguments(available: $available)]
    pub books: Option<Vec<BookModel>>
}