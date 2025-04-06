use async_graphql::{InputValueError, InputValueResult, Scalar, ScalarType, Value};
use serde::{Deserialize, Serialize};

pub mod query;

#[derive(Debug, Serialize, Deserialize)]
#[allow(clippy::upper_case_acronyms)]
pub struct UUID(uuid::Uuid);

#[Scalar]
impl ScalarType for UUID {
    fn parse(value: Value) -> InputValueResult<Self> {
        if let Value::String(value) = &value {
            Ok(value.parse().map(UUID)?)
        } else {
            Err(InputValueError::expected_type(value))
        }
    }

    fn to_value(&self) -> Value {
        Value::String(self.0.to_string())
    } 
}