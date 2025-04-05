use sea_orm::{DeriveActiveEnum, EnumIter, FromJsonQueryResult};
use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Copy, DeriveActiveEnum, EnumIter, Serialize, Deserialize, PartialEq, Eq)]
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
    Error = 14
}

#[derive(Debug, Default, DeriveActiveEnum, EnumIter, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[sea_orm(rs_type = "i16", db_type = "Integer")]
#[derive(async_graphql::Enum)]
pub enum MagicSlotType {
    #[default]
    NotExist = 0,
    Active = 1,
    Passive = 2
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub struct Magic {
    pub level: u16,
    pub slot_type: MagicSlotType,
    pub slot_number: u8,
    pub first_element: MagicElementType,
    pub second_element: MagicElementType,
    pub third_element: MagicElementType
}

#[async_graphql::Object]
impl Magic {
    async fn level(&self) -> u16 {
        self.level
    }

    async fn slot_type(&self) -> MagicSlotType {
        self.slot_type
    }

    async fn slot_number(&self) -> u8 {
        self.slot_number
    }

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

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, FromJsonQueryResult)]
pub struct Magics {
    pub types: Vec<Magic>
}

#[async_graphql::Object]
impl Magics {
    async fn types(&self) -> Vec<Magic> {
        self.types.clone()
    }
}