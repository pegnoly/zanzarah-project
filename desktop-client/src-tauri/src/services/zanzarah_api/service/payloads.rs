use uuid::Uuid;

use crate::services::prelude::{ConfirmEmailMutationVariables, ElementsQueryVariables, RegisterUserMutationVariables, WizformElementType, WizformsQueryVariables};

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

pub struct FilterWizformsPayload {
    pub book_id: Uuid,
    pub element: WizformElementType,
    pub name: String
}

impl From<FilterWizformsPayload> for WizformsQueryVariables {
    fn from(value: FilterWizformsPayload) -> Self {
        WizformsQueryVariables { book_id: value.book_id.into(), element: value.element, name: value.name }
    }
}

#[derive(Debug, Default)]
pub struct ElementsPayload {
    pub book_id: Uuid,
    pub enabled: Option<bool>
}

impl ElementsPayload {
    pub fn new(book_id: Uuid) -> Self {
        ElementsPayload {
            book_id,
            ..Default::default()
        }
    }

    pub fn enabled(mut self, enabled: bool) -> Self {
        self.enabled = Some(enabled);
        self
    }
}

impl From<ElementsPayload> for ElementsQueryVariables {
    fn from(value: ElementsPayload) -> Self {
        ElementsQueryVariables {
            book_id: value.book_id.into(),
            enabled: value.enabled
        }
    }
}