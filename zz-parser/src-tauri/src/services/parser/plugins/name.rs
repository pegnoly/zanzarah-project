use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub enum NamePluginType {
    SymbolResolver(SymbolRemover),
    NullDetector(NullCharDetector)
}

pub trait NamePlugin {
    fn apply(&self, name: &mut String);
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SymbolRemover {
    symbols: Vec<char>
}

impl SymbolRemover {
    pub fn new(symbols: Vec<char>) -> Self {
        SymbolRemover { symbols }
    }
}

impl NamePlugin for SymbolRemover {
    fn apply(&self, name: &mut String) {
        self.symbols.iter()
            .for_each(|s| {
                if name.contains(*s) {
                    *name = name.replace(*s, "").trim_start().to_string();
                }
            });
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NullCharDetector {}

impl NamePlugin for NullCharDetector {
    fn apply(&self, name: &mut String) {
        *name = name.trim_matches(char::from(0)).to_string();
    }
}