use sea_orm::{FromQueryResult, prelude::*};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::{book, location_section, location_wizform_entry};

#[derive(Debug, DeriveEntityModel, Serialize, Deserialize, Clone, PartialEq, Eq)]
#[sea_orm(table_name = "locations")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub section_id: Uuid,
    pub name: String,
    pub ordering: i32,
    pub game_number: Option<String>
}

pub type LocationModel = Model;

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Section,
    LocationWizformEntry,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Relation::Section => Entity::belongs_to(book::Entity)
                .from(Column::SectionId)
                .to(book::Column::Id)
                .into(),
            Relation::LocationWizformEntry => Entity::has_many(location_wizform_entry::Entity)
                .from(Column::Id)
                .to(location_wizform_entry::Column::LocationId)
                .into(),
        }
    }
}

impl Related<location_section::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Section.def()
    }
}

impl Related<location_wizform_entry::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::LocationWizformEntry.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct LocationWithEntriesCountModel {
    pub id: Uuid,
    pub name: String,
    pub entries_count: i64,
}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct LocationNameModel {
    pub location_name: String,
    pub section_name: String,
    pub comment: Option<String>,
}