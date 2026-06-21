use sea_orm::{FromQueryResult, prelude::*};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use shared_gen::book_enums::WizformElementType;
use super::{location, wizform};

#[derive(Debug, Serialize, Deserialize, PartialEq, Eq, Clone, DeriveEntityModel)]
#[sea_orm(table_name = "location_wizform_entries")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub location_id: Uuid,
    pub wizform_id: Uuid,
    pub comment: Option<String>,
}

pub type LocationWizformEntryModel = Model;

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Wizform,
    Location,
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
                .into(),
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

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LocationWizformInputModel {
    pub location_id: String,
    pub wizform_id: String
}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
pub struct LocationWizformFullEntry {
    pub id: Uuid,
    pub wizform_name: String,
    pub wizform_number: i16,
    pub wizform_element: WizformElementType,
    pub icon: String,
    pub comment: Option<String>
}
