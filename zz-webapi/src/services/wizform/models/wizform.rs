use sea_orm::entity::prelude::*;
use uuid::Uuid;

use super::magic::Magics;

#[derive(Debug, Default, Clone, Copy, EnumIter, DeriveActiveEnum, PartialEq, Eq)]
#[sea_orm(rs_type = "i16", db_type = "Integer")]
#[derive(async_graphql::Enum)]
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
    Custom1 = 14,
    Custom2 = 15,
    Custom3 = 16,
    Custom4 = 17,
    Custom5 = 18
}

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "wizforms")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub book_id: Uuid,
    pub game_id: String,
    pub element: WizformElementType,
    pub magics: Magics,
    pub number: i16,
    pub hitpoints: i16,
    pub agility: i16,
    pub jump_ability: i16,
    pub precision: i16,
    pub evolution_form: i16,
    pub evolution_level: i16,
    pub exp_modifier: i16,
    pub enabled: bool,
    pub description: String,
    pub icon64: String,
    pub name: Vec<u8>,
    pub cleared_name: String
}


pub type WizformModel = Model;

#[async_graphql::Object]
impl WizformModel {
    async fn id(&self) -> Uuid {
        self.id
    }

    async fn book_id(&self) -> Uuid {
        self.book_id
    }
    
    async fn game_id(&self) -> String {
        self.game_id.clone()
    }

    async fn element(&self) -> WizformElementType {
        self.element
    }

    async fn magics(&self) -> Magics {
        self.magics.clone()
    }
    async fn number(&self) -> i16 {
        self.number
    }

    async fn hitpoints(&self) -> i16 {
        self.hitpoints
    }

    async fn agility(&self) -> i16 {
        self.agility
    }

    async fn jump_ability(&self) -> i16 {
        self.jump_ability
    }

    async fn precision(&self) -> i16 {
        self.precision
    }

    async fn evolution_form(&self) -> i16 {
        self.evolution_form
    }

    async fn evolution_level(&self) -> i16 {
        self.evolution_level
    }

    async fn exp_modifier(&self) -> i16 {
        self.exp_modifier
    }

    async fn enabled(&self) -> bool {
        self.enabled
    }

    async fn description(&self) -> String {
        self.description.clone()
    }

    async fn icon64(&self) -> String {          
        self.icon64.clone()
    }

    async fn name(&self) -> String {
        self.cleared_name.clone()
    }
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}