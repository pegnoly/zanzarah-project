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
#[cynic(graphql_type = "Mutation", variables = "WizformsBulkInsertMutationArguments")]
pub struct WizformsBulkInsertMutation {
    #[arguments(wizforms: $wizforms)]
    pub insert_wizforms_bulk: InsertWizformsResponse
}