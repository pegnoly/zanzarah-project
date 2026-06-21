use sea_orm::{DeriveActiveEnum, EnumIter, FromJsonQueryResult};
use serde::{Deserialize, Serialize};
use shared_gen::book_enums::MagicElementType;

#[derive(
    Debug,
    Serialize,
    Deserialize,
    Clone,
    PartialEq,
    Eq,
    FromJsonQueryResult,
)]
pub struct MagicSlotModel {
    pub first_element: MagicElementType,
    pub second_element: MagicElementType,
    pub third_element: MagicElementType,
}

#[derive(
    Debug,
    Serialize,
    Deserialize,
    Clone,
    PartialEq,
    Eq,
    FromJsonQueryResult,
)]
pub struct Magic {
    pub level: u16,
    pub first_active_slot: MagicSlotModel,
    pub first_passive_slot: MagicSlotModel,
    pub second_active_slot: MagicSlotModel,
    pub second_passive_slot: MagicSlotModel,
}

#[derive(
    Debug,
    Serialize,
    Deserialize,
    Clone,
    PartialEq,
    Eq,
    FromJsonQueryResult,
)]
pub struct Magics {
    pub types: Vec<Magic>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MagicSlotInputModel {
    pub first_element: MagicElementType,
    pub second_element: MagicElementType,
    pub third_element: MagicElementType,
}

impl From<MagicSlotInputModel> for MagicSlotModel {
    fn from(val: MagicSlotInputModel) -> Self {
        MagicSlotModel {
            first_element: val.first_element,
            second_element: val.second_element,
            third_element: val.third_element,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MagicInputModel {
    pub level: u16,
    pub first_active_slot: MagicSlotInputModel,
    pub first_passive_slot: MagicSlotInputModel,
    pub second_active_slot: MagicSlotInputModel,
    pub second_passive_slot: MagicSlotInputModel,
}

impl From<MagicInputModel> for Magic {
    fn from(val: MagicInputModel) -> Self {
        Magic {
            level: val.level,
            first_active_slot: val.first_active_slot.into(),
            first_passive_slot: val.first_passive_slot.into(),
            second_active_slot: val.second_active_slot.into(),
            second_passive_slot: val.second_passive_slot.into(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct MagicsInputModel {
    pub types: Vec<MagicInputModel>,
}

impl From<MagicsInputModel> for Magics {
    fn from(val: MagicsInputModel) -> Self {
        Magics {
            types: val
                .types
                .into_iter()
                .map(|m| m.into())
                .collect::<Vec<Magic>>(),
        }
    }
}
