use sea_orm::entity::prelude::*;
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
    pub major_version: i16,
    pub minor_version: i16,
    pub patch_version: i16
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
    
    async fn major_version(&self) -> i16 {
        self.major_version
    }

    async fn minor_version(&self) -> i16 {
        self.minor_version
    }

    async fn patch_version(&self) -> i16 {
        self.patch_version
    }

}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookFullModel {
    pub id: Uuid,
    pub name: String,
    pub major_version: i32,
    pub minor_version: i32,
    pub patch_version: i32,
    pub wizforms_count: i32,
    pub active_wizforms_count: i32
}

#[async_graphql::Object]
impl BookFullModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn major_version(&self) -> i32 {
        self.major_version
    }

    async fn minor_version(&self) -> i32 {
        self.minor_version
    }

    async fn patch_version(&self) -> i32 {
        self.patch_version
    }

    async fn wizforms_count(&self) -> i32 {
        self.wizforms_count
    }

    async fn active_wizforms_count(&self) -> i32 {
        self.active_wizforms_count
    }
}