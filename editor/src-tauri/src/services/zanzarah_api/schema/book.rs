use cynic::{QueryFragment, QueryVariables};

use crate::services::zanzarah_api::schema;

#[derive(Debug, Clone, QueryFragment)]
pub struct CompatibleVersions {
    #[allow(dead_code)]
    versions: Vec<String>
}

#[derive(Debug, Clone, QueryFragment)]
#[cynic(graphql_type="BookModel")]
pub struct BookFullModel {
    pub id: cynic::Id,
    pub name: String,
    pub directory: String,
    pub initialized: bool,
    pub available: bool,
    pub version: String,
    pub compatible_with: CompatibleVersions
}

#[derive(Debug, QueryVariables)]
pub struct BooksQueryArguments {
    pub available: Option<bool>
}

#[derive(Debug, QueryFragment)]
#[cynic(graphql_type="QueryRoot", variables="BooksQueryArguments")]
pub struct BooksQuery {
    #[arguments(available: $available)]
    pub books: Option<Vec<BookFullModel>>
}

#[derive(Debug, QueryVariables)]
pub struct CreateBookMutationArguments {
    pub name: String,
    pub directory: String,
    pub version: String
}

#[derive(Debug, QueryFragment)]
#[cynic(graphql_type="MutationRoot", variables="CreateBookMutationArguments")]
pub struct CreateBookMutation {
    #[arguments(name: $name, directory: $directory, version: $version)]
    pub create_book: Option<BookFullModel>
}