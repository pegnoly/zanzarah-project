use serde::Serialize;
use strum::{Display, EnumString};

use crate::services::zz_api::schema;

#[derive(cynic::Enum, Debug, Default, Clone, Copy, PartialEq, Eq, EnumString, Display)]
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

#[derive(Debug, cynic::QueryFragment, Serialize, Clone)]
#[cynic(graphql_type = "WizformModel")]
pub struct WizformListModel {
    pub id: cynic::Id,
    pub icon64: String,
    pub name: String
}

#[derive(Debug, cynic::QueryVariables)]
pub struct WizformListArguments {
    pub book_id: cynic::Id,
    pub enabled: Option<bool>,
    pub element_filter: Option<WizformElementType>,
    pub name_filter: Option<String>
}

#[derive(Debug, cynic::QueryFragment)]
#[cynic(graphql_type = "Query", variables = "WizformListArguments")]
pub struct WizformListQuery {
    #[arguments(bookId: $book_id, enabled: $enabled, elementFilter: $element_filter, nameFilter: $name_filter)]
    pub wizforms: Option<Vec<WizformListModel>>
}