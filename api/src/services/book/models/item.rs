use sea_orm::{FromJsonQueryResult, FromQueryResult, prelude::*};
use serde::{Deserialize, Serialize};
use strum::{Display, EnumString};
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

#[derive(
    Debug,
    DeriveActiveEnum,
    EnumIter,
    EnumString,
    PartialEq,
    Eq,
    Clone,
    Copy,
    Serialize,
    Deserialize,
    Hash,
    Display,
    async_graphql::Enum
)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum ItemTransformType {
    #[sea_orm(string_value = "TRANSFORM_FROM")]
    #[serde(rename = "TRANSFORM_FROM")]
    #[strum(serialize = "TRANSFORM_FROM")]
    From,
    #[sea_orm(string_value = "TRANSFORM_TO")]
    #[serde(rename = "TRANSFORM_TO")]
    #[strum(serialize = "TRANSFORM_TO")]
    To
}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct ItemEvolutionModel {
    pub transform_type: ItemTransformType,
    pub item_name: String,
    pub item_icon: String,
    pub wizform_name: Option<String>,
    pub wizform_icon: Option<String>,
    pub spoilerable: bool
}

#[async_graphql::Object]
impl ItemEvolutionModel {

    async fn transform_type(&self) -> ItemTransformType {
        self.transform_type
    }

    async fn item_name(&self) -> &String {
        &self.item_name
    }

    async fn item_icon(&self) -> &String {
        &self.item_icon
    }

    async fn wizform_name(&self) -> Option<String> {
        self.wizform_name.clone()
    }

    async fn wizform_icon(&self) -> Option<String> {
        self.wizform_icon.clone()
    }

    async fn spoilerable(&self) -> bool {
        self.spoilerable
    }
}