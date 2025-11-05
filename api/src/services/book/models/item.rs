use sea_orm::{FromJsonQueryResult, FromQueryResult, prelude::*};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "items")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub book_id: Uuid,
    pub name: String,
    pub icon64: String,
    pub evolutions: EvolutionsList
}

#[derive(Debug, Clone, PartialEq, Eq, FromJsonQueryResult, Serialize, Deserialize, async_graphql::SimpleObject, async_graphql::InputObject)]
pub struct EvolutionListItem {
    pub from: i32,
    pub to: i32
}

#[derive(Debug, Clone, PartialEq, Eq, FromJsonQueryResult, Serialize, Deserialize, async_graphql::SimpleObject, async_graphql::InputObject)]
pub struct EvolutionsList {
    pub items: Vec<EvolutionListItem>
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

pub type ItemModel = Model;

#[async_graphql::Object]
impl ItemModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn book_id(&self) -> async_graphql::ID {
        self.book_id.into()
    }

    async fn name(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn icon64(&self) -> &String {
        &self.icon64
    }

    async fn evolutions_list(&self) -> &EvolutionsList {
        &self.evolutions
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, async_graphql::InputObject)]
pub struct ItemInputModel {
    pub book_id: async_graphql::ID,
    pub name: String,
    pub icon64: String,
    pub evolutions: EvolutionsList
}

#[derive(async_graphql::SimpleObject)]
pub struct ItemsBulkInsertResponse {
    pub message: String
}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct ItemEvolutionModel {
    pub item_name: String,
    pub item_icon: String,
    pub wizform_name: String,
    pub wizform_icon: String
}

#[async_graphql::Object]
impl ItemEvolutionModel {
    async fn item_name(&self) -> &String {
        &self.item_name
    }

    async fn item_icon(&self) -> &String {
        &self.item_icon
    }

    async fn wizform_name(&self) -> &String {
        &self.wizform_name
    }

    async fn wizform_icon(&self) -> &String {
        &self.wizform_icon
    }
}