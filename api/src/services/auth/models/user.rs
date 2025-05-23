use ::chrono::Local;
use sea_orm::{FromJsonQueryResult, prelude::*};
use serde::{Deserialize, Serialize};
use sqlx::types::chrono::{self, Utc};

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub email: String,
    pub password: String,
    pub confirmation_state: ConfirmationState,
    pub permissions: Permissions,
}

pub type UserModel = Model;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Copy)]
pub enum ModType {
    Global,
    Unbended,
    Redux,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Copy, async_graphql::Enum)]
pub enum PermissionType {
    UnconfirmedUser,
    ConfirmedUser,
    ModAdmin,
    SuperAdmin,
}

#[derive(
    Debug,
    Serialize,
    Deserialize,
    FromJsonQueryResult,
    Clone,
    PartialEq,
    Eq,
    async_graphql::SimpleObject,
)]
pub struct Permissions {
    pub types: Vec<PermissionType>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, async_graphql::SimpleObject)]
pub struct ConfirmationCodeInfo {
    pub value: String,
    pub expriration_time: chrono::DateTime<Local>,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq, async_graphql::SimpleObject)]
pub struct ActiveConfirmationInfo {
    pub activated_at: chrono::DateTime<Local>,
}

#[derive(
    Debug, Serialize, Deserialize, FromJsonQueryResult, Clone, PartialEq, Eq, async_graphql::Union,
)]
pub enum ConfirmationState {
    NotConfirmed(ConfirmationCodeInfo),
    Confirmed(ActiveConfirmationInfo),
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Collection,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Collection => {
                Entity::has_many(crate::services::book::models::collection::Entity).into()
            }
        }
    }
}

impl Related<crate::services::book::models::collection::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Collection.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

#[async_graphql::Object]
impl UserModel {
    async fn id(&self) -> async_graphql::ID {
        self.id.into()
    }

    async fn name(&self) -> &String {
        &self.name
    }

    async fn email(&self) -> &String {
        &self.email
    }

    async fn password(&self) -> &String {
        &self.password
    }

    async fn confirmation_state(&self) -> &ConfirmationState {
        &self.confirmation_state
    }

    async fn permissions(&self) -> &Permissions {
        &self.permissions
    }
}
