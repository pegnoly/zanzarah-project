pub use super::magic::{MagicElementType, MagicSlotInputModel, MagicInputModel, MagicsInputModel};
pub use super::wizform::{
    WizformElementType, 
    WizformInputModel, 
    InsertWizformsResponse, 
    WizformsBulkInsertMutation, 
    WizformsBulkInsertMutationArguments,
    WizformSimpleModel,
    WizformsQueryVariables,
    WizformsQuery,
    WizformEditableModel,
    WizformQueryVariables,
    WizformQuery,
    WizformUpdateModel,
    WizformUpdateMutationArguments,
    WizformUpdateMutation,
    UpdateWizformResponse
};
pub use super::element:: {
    ElementModel,
    ElementsQueryVariables,
    ElementsQuery
};
pub use super::book::{BookFullModel, BooksQuery, BooksQueryArguments};
pub use super::user::{RegisterUserMutation, RegisterUserMutationVariables, RegisterUserResponse, ConfirmEmailMutation, ConfirmEmailMutationVariables, EmailConfirmationResponse};