use sea_orm::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub salt: String,
    pub hashed_password: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType,
    pub confirmation_code: Option<String>,
}

pub type UserModel = Model;

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, Copy)]
pub enum ModType {
    Global,
    Unbended,
    Redux,
}

#[derive(
    Debug,
    Clone,
    PartialEq,
    Eq,
    Serialize,
    Deserialize,
    Copy,
    DeriveActiveEnum,
    EnumIter,
    async_graphql::Enum,
)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum UserPermissionType {
    #[sea_orm(string_value = "UNREGISTERED_USER")]
    UnregisteredUser,
    #[sea_orm(string_value = "USER")]
    User,
    #[sea_orm(string_value = "EDITOR")]
    Editor,
    #[sea_orm(string_value = "ADMIN")]
    Admin,
}

#[derive(
    Debug,
    Clone,
    PartialEq,
    Eq,
    Serialize,
    Deserialize,
    Copy,
    DeriveActiveEnum,
    EnumIter,
    async_graphql::Enum,
)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum RegistrationState {
    #[sea_orm(string_value = "UNREGISTERED")]
    Unregistered,
    #[sea_orm(string_value = "UNCONFIRMED")]
    Unconfirmed,
    #[sea_orm(string_value = "CONFIRMED")]
    Confirmed,
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

    async fn salt(&self) -> &String {
        &self.salt
    }

    async fn hashed_password(&self) -> &String {
        &self.hashed_password
    }

    async fn registration_state(&self) -> RegistrationState {
        self.registration_state
    }

    async fn permission(&self) -> UserPermissionType {
        self.permission
    }
}
