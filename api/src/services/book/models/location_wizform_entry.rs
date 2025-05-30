use sea_orm::{prelude::*, FromQueryResult};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::{location, wizform::{self, WizformElementType}};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Clone, DeriveEntityModel)]
#[sea_orm(table_name = "location_wizform_entries")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub location_id: Uuid,
    pub wizform_id: Uuid,
    pub comment: Option<String>
}

pub type LocationWizformEntryModel = Model;

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Wizform,
    Location
}

impl RelationTrait for Relation {
    fn def(&self) -> sea_orm::RelationDef {
        match self {
            Self::Wizform => Entity::belongs_to(wizform::Entity)
                .from(Column::WizformId)
                .to(wizform::Column::Id)
                .into(),
            Self::Location => Entity::belongs_to(location::Entity)
                .from(Column::LocationId)
                .to(location::Column::Id)
                .into()
        }
    }
}

impl Related<wizform::Entity> for Entity {
    fn to() -> sea_orm::RelationDef {
        Relation::Wizform.def()
    }
}

impl Related<location::Entity> for Entity {
    fn to() -> sea_orm::RelationDef {
        Relation::Location.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[async_graphql::Object]
impl LocationWizformEntryModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn location_id(&self) -> async_graphql::ID {
        self.location_id.into()
    }

    async fn wizform_id(&self) -> async_graphql::ID {
        self.wizform_id.into()
    }

    async fn comment(&self) -> Option<String> {
        self.comment.clone()
    }
}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct LocationWizformFullEntry {
    pub id: Uuid,
    pub wizform_name: String,
    pub wizform_number: i32,
    pub wizform_element: WizformElementType
}