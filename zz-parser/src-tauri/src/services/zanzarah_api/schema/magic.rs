use crate::services::zanzarah_api::schema;

use serde::Serialize;
use strum::{Display, EnumString, FromRepr};

#[derive(Debug, Default, cynic::Enum, EnumString, Display, FromRepr, Clone)]
#[repr(u8)]
pub enum MagicElementType {
    #[default]
    None = 0,
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
    Joker = 13,
    Error = 14
}

#[derive(Debug, cynic::QueryFragment, Serialize)]
pub struct MagicSlotModel {
    pub first_element: MagicElementType,
    pub second_element: MagicElementType,
    pub third_element: MagicElementType
}

#[derive(Debug, cynic::QueryFragment, Serialize)]
pub struct Magic {
    pub level: i32,
    pub first_active_slot: MagicSlotModel,
    pub first_passive_slot: MagicSlotModel,
    pub second_active_slot: MagicSlotModel,
    pub second_passive_slot: MagicSlotModel
}

#[derive(Debug, cynic::QueryFragment, Serialize)]
pub struct Magics {
    pub types: Vec<Magic>
}

#[derive(Debug, cynic::InputObject, Default, Clone)]
pub struct MagicSlotInputModel {
    pub first_element: MagicElementType,
    pub second_element: MagicElementType,
    pub third_element: MagicElementType
}

#[derive(Debug, cynic::InputObject, Default, Clone)]
pub struct MagicInputModel {
    pub level: i32,
    pub first_active_slot: MagicSlotInputModel,
    pub first_passive_slot: MagicSlotInputModel,
    pub second_active_slot: MagicSlotInputModel,
    pub second_passive_slot: MagicSlotInputModel
}

#[derive(Debug, cynic::InputObject, Clone)]
pub struct MagicsInputModel {
    pub types: Vec<MagicInputModel>
}