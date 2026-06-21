use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum DescPluginType {
    DescCleaner(DescCleaner)
}

pub trait DescPlugin {
    fn apply(&self, desc: String) -> String; 
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DescCleaner {
}

impl DescPlugin for DescCleaner {
    fn apply(&self, desc: String) -> String {
        let mut parts = desc.split('}');
        parts.next_back().unwrap().to_string()
    }
}