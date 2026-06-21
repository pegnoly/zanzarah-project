use sea_orm::{FromQueryResult, entity::prelude::*};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use shared_gen::book_enums::WizformElementType;
use shared_gen::book_models::WizformListModel;
use crate::error::ZZApiError;

use super::{
    collection_entry, location_wizform_entry,
    magic::{Magics, MagicsInputModel},
};

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

#[derive(DerivePartialModel)]
#[sea_orm(entity = "Entity")]
pub struct WizformUserModel {
    pub id: Uuid,
    pub name: String
}

pub type WizformModel = Model;

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

// #[derive(Debug, Clone, Serialize, Deserialize, async_graphql::InputObject)]
// pub struct WizformInputModel {
//     pub id: async_graphql::ID,
//     pub book_id: async_graphql::ID,
//     pub game_id: String,
//     pub element: WizformElementType,
//     pub magics: MagicsInputModel,
//     pub number: i16,
//     pub hitpoints: i16,
//     pub agility: i16,
//     pub jump_ability: i16,
//     pub precision: i16,
//     pub evolution_form: i32,
//     pub evolution_name: Option<String>,
//     pub previous_form: Option<i32>,
//     pub previous_form_name: Option<String>,
//     pub evolution_level: i16,
//     pub exp_modifier: i16,
//     pub enabled: bool,
//     pub description: String,
//     pub icon64: String,
//     pub name: String,
// }
//
// impl TryFrom<WizformInputModel> for WizformModel {
//     type Error = ZZApiError;
//
//     fn try_from(value: WizformInputModel) -> Result<Self, Self::Error> {
//         Ok(WizformModel {
//             id: Uuid::try_from(value.id)?,
//             book_id: Uuid::try_from(value.book_id)?,
//             game_id: value.game_id,
//             element: value.element,
//             magics: value.magics.into(),
//             number: value.number,
//             hitpoints: value.hitpoints,
//             agility: value.agility,
//             jump_ability: value.jump_ability,
//             precision: value.precision,
//             evolution_form: value.evolution_form,
//             evolution_name: value.evolution_name,
//             previous_form: value.previous_form,
//             previous_form_name: value.previous_form_name,
//             evolution_level: value.evolution_level,
//             exp_modifier: value.exp_modifier,
//             enabled: value.enabled,
//             description: value.description,
//             icon64: value.icon64,
//             name: value.name,
//         })
//     }
// }
//
// #[derive(Debug, Clone, Serialize, Deserialize, async_graphql::InputObject)]
// pub struct WizformUpdateModel {
//     pub id: async_graphql::ID,
//     pub enabled: Option<bool>,
//     pub element: Option<WizformElementType>,
//     pub name: Option<String>,
//     pub description: Option<String>,
// }
//
// #[derive(Debug, FromQueryResult, Serialize, Deserialize)]
// pub struct WizformSelectionModel {
//     pub id: Uuid,
//     pub name: String,
//     pub element: WizformElementType,
//     pub number: i16,
// }