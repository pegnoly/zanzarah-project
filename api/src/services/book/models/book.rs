use sea_orm::{FromJsonQueryResult, entity::prelude::*};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel)]
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
    async_graphql::SimpleObject,
)]
pub struct CompatibleVersions {
    pub versions: Vec<String>,
}

pub type BookModel = Model;

#[async_graphql::Object]
impl BookModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn name(&self) -> String {
        self.name.clone()
    }

    async fn directory(&self) -> String {
        self.directory.clone()
    }

    async fn initialized(&self) -> bool {
        self.initialized
    }

    async fn available(&self) -> bool {
        self.available
    }

    async fn version(&self) -> &String {
        &self.version
    }

    async fn compatible_with(&self) -> &CompatibleVersions {
        &self.compatible_with
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Collection,
    LocationSection
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Collection => Entity::has_many(super::collection::Entity).into(),
            Self::LocationSection => Entity::has_many(super::location_section::Entity).into()
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

#[async_graphql::Object]
impl BookFullModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn version(&self) -> &String {
        &self.version
    }

    async fn compatible_with(&self) -> &CompatibleVersions {
        &self.compatible_with
    }

    async fn wizforms_count(&self) -> i32 {
        self.wizforms_count
    }

    async fn active_wizforms_count(&self) -> i32 {
        self.active_wizforms_count
    }
}
