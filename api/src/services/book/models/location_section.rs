use sea_orm::{FromQueryResult, prelude::*};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::{book, location};

#[derive(Debug, DeriveEntityModel, Serialize, Deserialize, Clone, PartialEq, Eq)]
#[sea_orm(table_name = "location_sections")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub book_id: Uuid,
    pub name: String,
    pub ordering: i32,
}

pub type LocationSectionModel = Model;

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Book,
    Location,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Relation::Book => Entity::belongs_to(book::Entity)
                .from(Column::BookId)
                .to(book::Column::Id)
                .into(),
            Relation::Location => Entity::has_many(location::Entity)
                .from(Column::Id)
                .to(location::Column::SectionId)
                .into(),
        }
    }
}

impl Related<book::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Book.def()
    }
}

impl Related<location::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Location.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[async_graphql::Object]
impl LocationSectionModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn book_id(&self) -> async_graphql::ID {
        self.book_id.into()
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn ordering(&self) -> i32 {
        self.ordering
    }
}

#[derive(FromQueryResult, Serialize, Deserialize)]
pub struct LocationSectionWithCount {
    pub id: Uuid,
    pub name: String,
    pub locations_count: i64,
}

#[async_graphql::Object]
impl LocationSectionWithCount {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn locations_count(&self) -> i64 {
        self.locations_count
    }
}
