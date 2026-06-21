 use super::models::user::{RegistrationState, UserPermissionType};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct UserClaims {
    pub email: String,
    pub password: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType,
    pub exp: i64,
}

#[derive(Debug)]
pub struct RegistrationResult {
    pub user_id: String,
    pub email_hash: String,
    pub password_hash: String,
    pub token: String,
}

#[derive(Debug)]
pub struct AuthorizationResult {
    pub user_id: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType,
    pub name: String,
    pub avatar: String
}

#[derive(Debug)]
pub struct TokenUpdateResult {
    pub user_id: String,
    pub new_token: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType,
    pub name: String,
    pub avatar: String
}

#[derive(Debug)]
pub struct SignInResult {
    pub new_token: String,
    pub email_hash: String,
    pub password_hash: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType,
    pub user_id: String,
    pub name: String,
    pub avatar: String
}

#[derive(Debug)]
pub struct EmailConfirmationResult {
    pub new_token: String,
    pub registration_state: RegistrationState,
    pub permission: UserPermissionType,
    pub name: String,
    pub avatar: String
}
