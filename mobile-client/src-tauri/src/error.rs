use cynic::GraphQlError;

#[derive(Debug, thiserror::Error)]
pub enum ZZBookError {
    #[error(transparent)]
    CynicReqwestError(#[from]cynic::http::CynicReqwestError),
    #[error("Graphql errors in `{route}` route: `{errors:#?}`")]
    GraphQLErrorsArray {
        route: String,
        errors: Vec<GraphQlError>
    },
    #[error("Unknown graphql error")]
    UnknownGraphQLError,
    #[error("No data for `{0}`")]
    DataNotExist(String)
}

impl serde::Serialize for ZZBookError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
      S: serde::ser::Serializer,
    {
      serializer.serialize_str(self.to_string().as_ref())
    }
}