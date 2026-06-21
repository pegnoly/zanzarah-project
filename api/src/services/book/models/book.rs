use sea_orm::{FromJsonQueryResult, entity::prelude::*};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel, sqlx::FromRow)]
#[sea_orm(table_name = "books")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub name: String,
    pub directory: String,
    pub initialized: bool,
    pub available: bool,
    pub version: String,
    pub compatible_with: CompatibleVersions,
}

#[derive(
    Debug,
    Serialize,
    Deserialize,
    Clone,
    PartialEq,
    Eq,
    FromJsonQueryResult,
    sqlx::Type
)]
pub struct CompatibleVersions {
    pub versions: Vec<String>,
}

pub type BookModel = Model;

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Collection,
    LocationSection,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Collection => Entity::has_many(super::collection::Entity).into(),
            Self::LocationSection => Entity::has_many(super::location_section::Entity).into(),
        }
    }
}

impl Related<super::collection::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Collection.def()
    }
}

impl Related<super::location_section::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::LocationSection.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookFullModel {
    pub id: Uuid,
    pub name: String,
    pub version: String,
    pub compatible_with: CompatibleVersions,
    pub wizforms_count: i32,
    pub active_wizforms_count: i32,
}
