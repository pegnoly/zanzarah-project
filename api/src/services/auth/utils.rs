use serde::{Deserialize, Serialize};
use super::models::user::{RegistrationState, UserPermissionType};

#[derive(Debug, Serialize, Deserialize)]
pub struct UserClaims {
    pub email: String,
    pub password: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType,
    pub exp: i64
}

#[derive(Debug, async_graphql::SimpleObject)]
pub struct RegistrationResult {
    pub email_hash: String,
    pub password_hash: String,
    pub token: String
}

#[derive(Debug, async_graphql::SimpleObject)]
pub struct AuthorizationResult {
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType
}

#[derive(Debug, async_graphql::SimpleObject)]
pub struct TokenUpdateResult {
    pub new_token: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType
}