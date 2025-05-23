use sea_orm::entity::prelude::*;
use uuid::Uuid;

use super::wizform::WizformElementType;

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "elements")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub book_id: Uuid,
    pub name: String,
    pub element: WizformElementType,
    pub enabled: bool,
}

pub type ElementModel = Model;

#[async_graphql::Object]
impl ElementModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn book_id(&self) -> async_graphql::ID {
        self.book_id.into()
    }

    async fn name(&self) -> String {
        self.name.clone()
    }

    async fn element(&self) -> WizformElementType {
        self.element
    }

    async fn enabled(&self) -> bool {
        self.enabled
    }
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
