use sea_orm::entity::prelude::*;
use uuid::Uuid;
use shared_gen::book_enums::WizformElementType;

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

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
