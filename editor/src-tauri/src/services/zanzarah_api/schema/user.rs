// use crate::services::zanzarah_api::schema;

// #[derive(Debug, cynic::QueryVariables)]
// pub struct RegisterUserMutationVariables {
//     pub email: String,
//     pub password: String
// }

// #[derive(Debug, cynic::QueryFragment)]
// pub struct RegisterUserResponse {
//     pub message: String
// }

// #[derive(Debug, cynic::QueryFragment)]
// #[cynic(graphql_type = "MutationRoot", variables = "RegisterUserMutationVariables")]
// pub struct RegisterUserMutation {
//     #[arguments(email: $email, password: $password)]
//     pub try_register_user: RegisterUserResponse
// }

// #[derive(Debug, cynic::QueryVariables)]
// pub struct ConfirmEmailMutationVariables {
//     pub email: String,
//     pub code: String
// }

// #[derive(Debug, cynic::QueryFragment)]
// pub struct EmailConfirmationResponse {
//     pub message: String
// }

// #[derive(Debug, cynic::QueryFragment)]
// #[cynic(graphql_type = "Mutation", variables = "ConfirmEmailMutationVariables")]
// pub struct ConfirmEmailMutation {
//     #[arguments(email: $email, code: $code)]
//     pub confirm_email: EmailConfirmationResponse
// }