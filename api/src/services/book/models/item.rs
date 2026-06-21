use sea_orm::prelude::*;
use uuid::Uuid;

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "items")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub book_id: Uuid,
    pub name: String,
    pub icon64: String,
    pub evolutions: shared_gen::book_models::EvolutionsListModel
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}

pub type ItemModel = Model;