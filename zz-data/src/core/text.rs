use serde::{Deserialize, Serialize};

/// Represents text parsed from game files.
#[derive(Debug, Serialize, Deserialize)]
pub struct Text {
    id: String,
    content_length: i32,
    content: String,
    text_type: i32,
    mark: String
}