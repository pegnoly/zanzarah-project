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
    pub user_id: async_graphql::ID,
    pub email_hash: String,
    pub password_hash: String,
    pub token: String
}

#[derive(Debug, async_graphql::SimpleObject)]
pub struct AuthorizationResult {
    pub user_id: async_graphql::ID,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType
}

#[derive(Debug, async_graphql::SimpleObject)]
pub struct TokenUpdateResult {
    pub user_id: async_graphql::ID,
    pub new_token: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType
}

#[derive(Debug, async_graphql::SimpleObject)]
pub struct SignInResult {
    pub new_token: String,
    pub email_hash: String,
    pub password_hash: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType,
    pub user_id: async_graphql::ID
}

#[derive(Debug, async_graphql::SimpleObject)]
pub struct EmailConfirmationResult {
    pub new_token: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType
}