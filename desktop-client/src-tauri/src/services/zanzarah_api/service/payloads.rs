use uuid::Uuid;

use crate::services::prelude::{CreateBookMutationArguments, ElementsQueryVariables, WizformElementType, WizformUpdateModel, WizformUpdateMutationArguments, WizformsQueryVariables};

pub struct RegisterUserPayload {
    pub email: String,
    pub password: String
}

// impl From<RegisterUserPayload> for RegisterUserMutationVariables {
//     fn from(value: RegisterUserPayload) -> Self {
//         RegisterUserMutationVariables { email: value.email, password: value.password }
//     }
// }

// pub struct ConfirmEmailPayload {
//     pub email: String,
//     pub code: String
// }

// impl From<ConfirmEmailPayload> for ConfirmEmailMutationVariables {
//     fn from(value: ConfirmEmailPayload) -> Self {
//         ConfirmEmailMutationVariables { email: value.email, code: value.code }
//     }
// }

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

#[derive(Debug, Default)]
pub struct UpdateWizformPayload {
    pub id: Uuid,
    pub enabled: Option<bool>,
    pub element: Option<WizformElementType>,
    pub name: Option<String>,
    pub description: Option<String>
}

impl UpdateWizformPayload {
    pub fn new(id: Uuid) -> Self {
        UpdateWizformPayload {
            id,
            ..Default::default()
        }
    }

    pub fn enabled(mut self, enabled: bool) -> Self {
        self.enabled = Some(enabled);
        self
    }

    pub fn with_element(mut self, element: WizformElementType) -> Self {
        self.element = Some(element);
        self
    }

    pub fn with_name(mut self, name: String) -> Self {
        self.name = Some(name);
        self
    }

    pub fn with_description(mut self, decription: String) -> Self {
        self.description = Some(decription);
        self
    }
}

impl From<UpdateWizformPayload> for WizformUpdateMutationArguments {
    fn from(value: UpdateWizformPayload) -> Self {
        WizformUpdateMutationArguments { update_model: WizformUpdateModel {
            id: value.id.into(),
            enabled: value.enabled,
            element: value.element,
            name: value.name,
            description: value.description,
        } }
    }
}

#[derive(Debug)]
pub struct CreateBookPayload {
    pub name: String,
    pub directory: String,
    pub version: String
}

impl From<CreateBookPayload> for CreateBookMutationArguments {
    fn from(value: CreateBookPayload) -> Self {
        CreateBookMutationArguments {
            name: value.name,
            directory: value.directory,
            version: value.version
        }
    }
}