pub use super::magic::{MagicElementType, MagicSlotInputModel, MagicInputModel, MagicsInputModel};
pub use super::wizform::{
    WizformElementType, 
    WizformInputModel, 
    InsertWizformsResponse, 
    WizformsBulkInsertMutation, 
    WizformsBulkInsertMutationArguments
};
pub use super::book::{BookFullModel, BooksQuery, BooksQueryArguments};
pub use super::user::{RegisterUserMutation, RegisterUserMutationVariables, RegisterUserResponse, ConfirmEmailMutation, ConfirmEmailMutationVariables, EmailConfirmationResponse};