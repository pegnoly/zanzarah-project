use sea_orm::{FromQueryResult, prelude::*};
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
    pub avatar_wizform_id: Uuid 
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

#[derive(Debug, FromQueryResult, Serialize, Deserialize, Clone)]
pub struct UserFullModel {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub hashed_password: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType,
    pub confirmation_code: Option<String>,
    pub avatar: String
}