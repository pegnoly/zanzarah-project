use sea_orm::prelude::*;

use super::wizform;

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "collection_entries")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub collection_id: Uuid,
    pub wizform_id: Uuid,
}

pub type CollectionEntryModel = Model;

#[async_graphql::Object]
impl CollectionEntryModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn collection_id(&self) -> async_graphql::ID {
        self.collection_id.into()
    }

    async fn wizform_id(&self) -> async_graphql::ID {
        self.wizform_id.into()
    }
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Wizform,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Wizform => Entity::belongs_to(wizform::Entity)
                .from(Column::WizformId)
                .to(wizform::Column::Id)
                .into(),
        }
    }
}

impl Related<wizform::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Wizform.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
