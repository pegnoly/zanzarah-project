use sea_orm::{DeriveActiveEnum, EnumIter, FromJsonQueryResult};
use serde::{Deserialize, Serialize};

#[derive(
    Debug, Default, Clone, Copy, DeriveActiveEnum, EnumIter, Serialize, Deserialize, PartialEq, Eq,
)]
#[sea_orm(rs_type = "i16", db_type = "Integer")]
#[derive(async_graphql::Enum)]
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
    Error = 14,
}

#[derive(
    Debug,
    Serialize,
    Deserialize,
    Clone,
    PartialEq,
    Eq,
    FromJsonQueryResult,
    async_graphql::InputObject,
)]
pub struct MagicSlotModel {
    pub first_element: MagicElementType,
    pub second_element: MagicElementType,
    pub third_element: MagicElementType,
}

#[async_graphql::Object]
impl MagicSlotModel {
    async fn first_element(&self) -> MagicElementType {
        self.first_element
    }

    async fn second_element(&self) -> MagicElementType {
        self.second_element
    }

    async fn third_element(&self) -> MagicElementType {
        self.third_element
    }
}

#[derive(
    Debug,
    Serialize,
    Deserialize,
    Clone,
    PartialEq,
    Eq,
    FromJsonQueryResult,
    async_graphql::InputObject,
)]
pub struct Magic {
    pub level: u16,
    pub first_active_slot: MagicSlotModel,
    pub first_passive_slot: MagicSlotModel,
    pub second_active_slot: MagicSlotModel,
    pub second_passive_slot: MagicSlotModel,
}

#[async_graphql::Object]
impl Magic {
    async fn level(&self) -> u16 {
        self.level
    }

    async fn first_active_slot(&self) -> MagicSlotModel {
        self.first_active_slot.clone()
    }

    async fn first_passive_slot(&self) -> MagicSlotModel {
        self.first_passive_slot.clone()
    }

    async fn second_active_slot(&self) -> MagicSlotModel {
        self.second_active_slot.clone()
    }

    async fn second_passive_slot(&self) -> MagicSlotModel {
        self.second_passive_slot.clone()
    }
}

#[derive(
    Debug,
    Serialize,
    Deserialize,
    Clone,
    PartialEq,
    Eq,
    FromJsonQueryResult,
    async_graphql::InputObject,
)]
pub struct Magics {
    pub types: Vec<Magic>,
}

#[async_graphql::Object]
impl Magics {
    async fn types(&self) -> Vec<Magic> {
        self.types.clone()
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, async_graphql::InputObject)]
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

#[derive(Debug, Serialize, Deserialize, Clone, async_graphql::InputObject)]
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

#[derive(Debug, Serialize, Deserialize, Clone, async_graphql::InputObject)]
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
