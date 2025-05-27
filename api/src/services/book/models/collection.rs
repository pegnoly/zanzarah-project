use sea_orm::{prelude::*, FromQueryResult};
use serde::{Deserialize, Serialize};

use super::collection_entry;

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "collections")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub book_id: Uuid,
    pub user_id: Uuid,
    pub created_on_version: String,
    pub name: String,
    pub active: bool,
}

pub type CollectionModel = Model;

#[async_graphql::Object]
impl CollectionModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn book_id(&self) -> async_graphql::ID {
        self.book_id.into()
    }

    async fn user_id(&self) -> async_graphql::ID {
        self.user_id.into()
    }

    async fn created_on_version(&self) -> &String {
        &self.created_on_version
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn active(&self) -> bool {
        self.active
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Book,
    User,
    CollectionEntry,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Book => Entity::belongs_to(super::book::Entity)
                .from(Column::BookId)
                .to(super::book::Column::Id)
                .into(),
            Self::User => Entity::belongs_to(crate::services::auth::models::user::Entity)
                .from(Column::UserId)
                .to(crate::services::auth::models::user::Column::Id)
                .into(),
            Self::CollectionEntry => Entity::has_many(collection_entry::Entity)
                .from(Column::Id)
                .to(collection_entry::Column::CollectionId)
                .into()
        }
    }
}

impl Related<super::book::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Book.def()
    }
}

impl Related<crate::services::auth::models::user::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::User.def()
    }
}

impl Related<collection_entry::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::CollectionEntry.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct CollectionFullModel {
    pub id: Uuid,
    pub book_id: Uuid,
    pub user_id: Uuid,
    pub created_on_version: String,
    pub name: String,
    pub active: bool,
    pub entries_count: i64
}

#[async_graphql::Object]
impl CollectionFullModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn book_id(&self) -> async_graphql::ID {
        self.book_id.into()
    }

    async fn user_id(&self) -> async_graphql::ID {
        self.user_id.into()
    }

    async fn created_on_version(&self) -> &String {
        &self.created_on_version
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn active(&self) -> bool {
        self.active
    }
    
    async fn entries_count(&self) -> i64 {
        self.entries_count
    }
}