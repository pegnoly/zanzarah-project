use serde::{Deserialize, Serialize};
use uuid::Uuid;
use sea_orm::{prelude::*, FromQueryResult};

use super::{book, location_section, location_wizform_entry};

#[derive(Debug, DeriveEntityModel, Serialize, Deserialize, Clone, PartialEq, Eq)]
#[sea_orm(table_name = "locations")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub section_id: Uuid,
    pub name: String,
    pub ordering: i32
}

pub type LocationModel = Model;

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Section,
    LocationWizformEntry
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
                .into()
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

#[async_graphql::Object]
impl LocationModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn section_id(&self) -> async_graphql::ID {
        self.section_id.into()
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn ordering(&self) -> i32 {
        self.ordering
    }
}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct LocationWithEntriesCountModel {
    pub id: Uuid,
    pub name: String,
    pub entries_count: i64
}

#[async_graphql::Object]
impl LocationWithEntriesCountModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn entries_count(&self) -> i64 {
        self.entries_count
    }
}