use std::num::{ParseIntError, TryFromIntError};

use bmp::BmpError;
use cynic::GraphQlError;

#[derive(Debug, thiserror::Error)]
pub enum ZZParserError {
    #[error(transparent)]
    IO(#[from]std::io::Error),
    #[error(transparent)]
    IntConversion(#[from]TryFromIntError),
    #[error(transparent)]
    ParseInt(#[from]ParseIntError),
    #[error("Path of `{0}` not exists")]
    PathNotExists(String),
    #[error(transparent)]
    Bmp(#[from]BmpError),
    #[error("Text with id `{0}` is not found")]
    UnknownTextId(String),
    #[error("Failed to parse magic: `{0}`")]
    ParseMagic(String),
    #[error("Failed to construct variant of enum `{enum_type}` from value `{value}`")]
    UnknownEnumRepr { enum_type: String, value: i32 },
    #[error(transparent)]
    CynicReqwestError(#[from]cynic::http::CynicReqwestError),
    #[error("Graphql errors in `{route}` route: `{errors:#?}`")]
    GraphQLErrorsArray {
        route: String,
        errors: Vec<GraphQlError>
    },
    #[error("Unknown graphql error")]
    UnknownGraphQLError,
}

impl serde::Serialize for ZZParserError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}