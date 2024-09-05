use serde::{Deserialize, Serialize};

/// Represents text parsed from game files.
#[derive(Debug, Serialize, Deserialize)]
pub struct Text {
    pub id: String,
    pub content_length: i32,
    pub content: String,
    pub text_type: i32,
    pub mark: String
}