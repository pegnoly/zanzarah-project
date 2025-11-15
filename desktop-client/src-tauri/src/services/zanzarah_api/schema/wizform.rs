use serde::Serialize;
use strum::{Display, EnumIter, EnumString, FromRepr};

use crate::services::zanzarah_api::schema;

use super::magic::MagicsInputModel;

#[derive(cynic::Enum, Debug, Default, Clone, Copy, PartialEq, Eq, EnumString, Display, EnumIter, FromRepr)]
#[repr(i32)]
pub enum WizformElementType {
    None = -1,
    NeutralOne = 0,
    #[default]
    Nature = 1,
    Air = 2,
    Water = 3,
    Light = 4,
    Energy = 5,
    Psi = 6,
    Stone = 7,
    Ice = 8,
    Fire = 9,
    Dark = 10,
    Chaos = 11,
    Metall = 12,
    NeutralTwo = 13,
    #[cynic(rename = "CUSTOM_1")]
    Custom1 = 14,
    #[cynic(rename = "CUSTOM_2")]
    Custom2 = 15,
    #[cynic(rename = "CUSTOM_3")]
    Custom3 = 16,
    #[cynic(rename = "CUSTOM_4")]
    Custom4 = 17,
    #[cynic(rename = "CUSTOM_5")]
    Custom5 = 18
}

#[derive(Debug, cynic::InputObject, Clone)]
pub struct WizformInputModel {
    pub id: cynic::Id,
    pub book_id: cynic::Id,
    pub game_id: String,
    pub element: WizformElementType,
    pub magics: MagicsInputModel,
    pub number: i32,
    pub hitpoints: i32,
    pub agility: i32,
    pub jump_ability: i32,
    pub precision: i32,
    pub evolution_form: i32,
    pub evolution_name: Option<String>,
    pub previous_form: Option<i32>,
    pub previous_form_name: Option<String>,
    pub evolution_level: i32,
    pub exp_modifier: i32,
    pub enabled: bool,
    pub description: String,
    pub icon64: String,
    pub name: String
}

#[derive(Debug, cynic::QueryVariables)]
pub struct WizformsBulkInsertMutationArguments {
    pub wizforms: Vec<WizformInputModel>
}

#[derive(Debug, cynic::QueryFragment)]
pub struct InsertWizformsResponse {
    pub message: String
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "MutationRoot", variables = "WizformsBulkInsertMutationArguments")]
pub struct WizformsBulkInsertMutation {
    #[arguments(wizforms: $wizforms)]
    pub insert_wizforms_bulk: InsertWizformsResponse
}

#[derive(Debug, cynic::QueryFragment, Serialize, Clone)]
#[cynic(graphql_type = "WizformListModel")]
pub struct WizformSimpleModel {
    pub id: cynic::Id,
    pub name: String,
    pub icon64: String,
    pub enabled: bool,
    pub number: i32
}

#[derive(Debug, cynic::QueryVariables)]
pub struct WizformsQueryVariables {
    pub book_id: cynic::Id,
    pub element: WizformElementType,
    pub name: String
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "QueryRoot", variables = "WizformsQueryVariables")]
pub struct WizformsQuery {
    #[arguments(bookId: $book_id, elementFilter: $element, nameFilter: $name)]
    pub wizforms: Vec<WizformSimpleModel>
}

#[derive(Debug, cynic::QueryVariables)]
pub struct AllWizformsQueryVariables {
    pub book_id: cynic::Id
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "QueryRoot", variables = "AllWizformsQueryVariables")]
pub struct AllWizformsQuery {
    #[arguments(bookId: $book_id)]
    pub all_wizforms: Vec<WizformSimpleModel>
}

#[derive(Debug, cynic::QueryFragment, Serialize, Clone)]
#[cynic(graphql_type = "CollectionWizform")]
pub struct WizformEditableModel {
    pub id: cynic::Id,
    pub enabled: bool,
    pub element: WizformElementType,
    pub name: String,
    pub description: String
}

#[derive(Debug, cynic::QueryVariables)]
pub struct WizformQueryVariables {
    pub id: cynic::Id
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "QueryRoot", variables = "WizformQueryVariables")]
pub struct WizformQuery {
    #[arguments(id: $id)]
    pub wizform: Option<WizformEditableModel>
}

#[derive(Debug, cynic::QueryFragment)]
pub struct UpdateWizformResponse {
    pub message: String
}

#[derive(Debug, cynic::InputObject, Clone)]
pub struct WizformUpdateModel {
    pub id: cynic::Id,
    pub enabled: Option<bool>,
    pub element: Option<WizformElementType>,
    pub name: Option<String>,
    pub description: Option<String>
}

#[derive(Debug, cynic::QueryVariables)]
pub struct WizformUpdateMutationArguments {
    pub update_model: WizformUpdateModel
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "MutationRoot", variables = "WizformUpdateMutationArguments")]
pub struct WizformUpdateMutation {
    #[arguments(updateModel: $update_model)]
    pub update_wizform: UpdateWizformResponse
}