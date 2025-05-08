use crate::services::prelude::{ConfirmEmailMutationVariables, RegisterUserMutationVariables};

pub struct RegisterUserPayload {
    pub email: String,
    pub password: String
}

impl From<RegisterUserPayload> for RegisterUserMutationVariables {
    fn from(value: RegisterUserPayload) -> Self {
        RegisterUserMutationVariables { email: value.email, password: value.password }
    }
}

pub struct ConfirmEmailPayload {
    pub email: String,
    pub code: String
}

impl From<ConfirmEmailPayload> for ConfirmEmailMutationVariables {
    fn from(value: ConfirmEmailPayload) -> Self {
        ConfirmEmailMutationVariables { email: value.email, code: value.code }
    }
}