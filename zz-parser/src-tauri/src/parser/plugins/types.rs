use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum NamePluginType {
    SymbolResolver,
    NullDetector
}

pub trait NamePlugin {
    fn apply(&self, name: String) -> String;
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SymbolRemover {
    symbols: Vec<char>
}

impl NamePlugin for SymbolRemover {
    fn apply(&self, name: String) -> String {
        let mut answer = name;
        self.symbols.iter()
            .for_each(|s| {
                if answer.contains(*s) {
                    answer = answer.replace(*s, "").trim_start().to_string();
                }
            });
        answer 
    }
}

pub struct NullCharDetector {}

impl NamePlugin for NullCharDetector {
    fn apply(&self, name: String) -> String {
        let answer = name.trim_matches(char::from(0));
        answer.to_string()
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub enum DescPluginType {
    DescCleaner
}

pub trait DescPlugin {
    fn apply(&self, desc: String) -> String; 
}

pub struct DescCleaner {
}

impl DescPlugin for DescCleaner {
    fn apply(&self, desc: String) -> String {
        let parts = desc.split('}');
        parts.last().unwrap().to_string()
    }
}