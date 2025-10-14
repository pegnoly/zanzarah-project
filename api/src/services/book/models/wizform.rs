use sea_orm::{FromQueryResult, entity::prelude::*};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::error::ZZApiError;

use super::{
    collection_entry, location_wizform_entry,
    magic::{Magics, MagicsInputModel},
};

#[derive(
    Debug, Default, Clone, Copy, EnumIter, DeriveActiveEnum, PartialEq, Eq, Serialize, Deserialize,
)]
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
    Custom5 = 18,
}

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel, async_graphql::InputObject)]
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
    pub evolution_form: i32,
    pub evolution_name: Option<String>,
    pub previous_form: Option<i32>,
    pub previous_form_name: Option<String>,
    pub evolution_level: i16,
    pub exp_modifier: i16,
    pub enabled: bool,
    pub description: String,
    pub icon64: String,
    pub name: String,
}

#[derive(FromQueryResult, DerivePartialModel)]
#[sea_orm(entity = "Entity")]
pub struct WizformNameModel {
    pub name: String,
}

pub type WizformModel = Model;

#[async_graphql::Object]
impl WizformModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn book_id(&self) -> async_graphql::ID {
        self.book_id.into()
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

    async fn evolution_form(&self) -> i32 {
        self.evolution_form
    }

    async fn evolution_name(&self) -> Option<String> {
        self.evolution_name.clone()
    }

    async fn previous_form(&self) -> Option<i32> {
        self.previous_form
    }

    async fn previous_form_name(&self) -> Option<String> {
        self.previous_form_name.clone()
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
        self.name.clone()
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    CollectionEntry,
    LocationEntry,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::CollectionEntry => Entity::has_many(collection_entry::Entity)
                .from(Column::Id)
                .to(collection_entry::Column::WizformId)
                .into(),
            Self::LocationEntry => Entity::has_many(location_wizform_entry::Entity)
                .from(Column::Id)
                .to(location_wizform_entry::Column::WizformId)
                .into(),
        }
    }
}

impl Related<collection_entry::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::CollectionEntry.def()
    }
}

impl Related<location_wizform_entry::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::LocationEntry.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::InputObject)]
pub struct WizformInputModel {
    pub id: async_graphql::ID,
    pub book_id: async_graphql::ID,
    pub game_id: String,
    pub element: WizformElementType,
    pub magics: MagicsInputModel,
    pub number: i16,
    pub hitpoints: i16,
    pub agility: i16,
    pub jump_ability: i16,
    pub precision: i16,
    pub evolution_form: i32,
    pub evolution_name: Option<String>,
    pub previous_form: Option<i32>,
    pub previous_form_name: Option<String>,
    pub evolution_level: i16,
    pub exp_modifier: i16,
    pub enabled: bool,
    pub description: String,
    pub icon64: String,
    pub name: String,
}

impl TryFrom<WizformInputModel> for WizformModel {
    type Error = ZZApiError;

    fn try_from(value: WizformInputModel) -> Result<Self, Self::Error> {
        Ok(WizformModel {
            id: Uuid::try_from(value.id)?,
            book_id: Uuid::try_from(value.book_id)?,
            game_id: value.game_id,
            element: value.element,
            magics: value.magics.into(),
            number: value.number,
            hitpoints: value.hitpoints,
            agility: value.agility,
            jump_ability: value.jump_ability,
            precision: value.precision,
            evolution_form: value.evolution_form,
            evolution_name: value.evolution_name,
            previous_form: value.previous_form,
            previous_form_name: value.previous_form_name,
            evolution_level: value.evolution_level,
            exp_modifier: value.exp_modifier,
            enabled: value.enabled,
            description: value.description,
            icon64: value.icon64,
            name: value.name,
        })
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::InputObject)]
pub struct WizformUpdateModel {
    pub id: async_graphql::ID,
    pub enabled: Option<bool>,
    pub element: Option<WizformElementType>,
    pub name: Option<String>,
    pub description: Option<String>,
}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct CollectionWizform {
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
    pub evolution_form: i32,
    pub evolution_name: Option<String>,
    pub previous_form: Option<i32>,
    pub previous_form_name: Option<String>,
    pub evolution_level: i16,
    pub exp_modifier: i16,
    pub enabled: bool,
    pub description: String,
    pub icon64: String,
    pub name: String,
    pub in_collection_id: Option<Uuid>,
}

#[async_graphql::Object]
impl CollectionWizform {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn book_id(&self) -> async_graphql::ID {
        self.book_id.into()
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

    async fn evolution_form(&self) -> i32 {
        self.evolution_form
    }

    async fn evolution_name(&self) -> Option<String> {
        self.evolution_name.clone()
    }

    async fn previous_form(&self) -> Option<i32> {
        self.previous_form
    }

    async fn previous_form_name(&self) -> Option<String> {
        self.previous_form_name.clone()
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
        self.name.clone()
    }

    async fn in_collection_id(&self) -> Option<Uuid> {
        self.in_collection_id
    }
}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct WizformSelectionModel {
    pub id: Uuid,
    pub name: String,
    pub element: WizformElementType,
    pub number: i16,
}

#[async_graphql::Object]
impl WizformSelectionModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn element(&self) -> WizformElementType {
        self.element
    }

    async fn number(&self) -> i16 {
        self.number
    }
}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct WizformListModel {
    pub id: Uuid,
    pub name: String,
    pub icon64: String,
    pub number: i16,
    pub enabled: bool,
    pub in_collection_id: Option<Uuid>
}

#[async_graphql::Object]
impl WizformListModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn icon64(&self) -> &String {
        &self.icon64
    }

    async fn number(&self) -> i16 {
        self.number
    }

    async fn enabled(&self) -> bool {
        self.enabled
    }

    async fn in_collection_id(&self) -> Option<Uuid> {
        self.in_collection_id
    }
}