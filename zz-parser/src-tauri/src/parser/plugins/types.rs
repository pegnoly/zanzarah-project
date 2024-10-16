pub enum WizformNamePluginType {
    SymbolRemovePlugin(SymbolRemover)   
}

pub enum WizformDescPluginType {
    DescCleanerPlugin(DescCleaner)
}

pub struct SymbolRemover {
    symbols: Vec<char>
}

impl SymbolRemover {

    pub fn new() -> Self {
        SymbolRemover { 
            symbols: vec!['ќ', 'Ў', 'Ђ', 'Џ', 'Њ', 'љ', 'Ї', 'ѓ', 'џ', 'Љ', 'Ќ', 'њ', 'ў', 'Ѓ', 'Ћ']  
        }
    }

    pub fn apply(&self, name: String) -> String {
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

pub struct DescCleaner {
}

impl DescCleaner {
    pub fn apply(&self, desc: String) -> String {
        let parts = desc.split('}');
        parts.last().unwrap().to_string()
    }
}