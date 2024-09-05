use serde::{Deserialize, Serialize};
use strum::FromRepr;

use super::magic::Magic;

#[derive(Debug, Serialize, Default, Deserialize, FromRepr)]
#[repr(u8)]
pub enum WizformElementType {
    NeutralOne,
    #[default]
    Nature,
    Air,
    Water,
    Light,
    Energy,
    Psi,
    Stone,
    Ice,
    Fire,
    Dark,
    Chaos,
    Metall,
    NeutralTwo,
    Custom1,
    Custom2,
    Custom3,
    Custom4,
    Custom5
}

/// Represents a wizform parsed from the game files
#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Wizform {
    pub id: String,
    pub model: String,
    /// Id of name text in game texts
    pub name: String,
    /// Id of desc text in game texts
    pub desc: String,
    pub element: WizformElementType,
    pub magics: Vec<Magic>,
    pub number: u16,
    pub hitpoints: i32,
    pub agility: i32,
    pub jump_ability: i32,
    pub precision: i32,
    /// Number of wizform this one evolutes into (-501 if no evolution)
    pub evolution_form: i32,
    /// Level this wizform evolutes(-1 if no evolution)
    pub evolution_level: i32,
    pub voice_type: i32,
    pub exp_modifier: i32
}

impl Wizform {
    pub fn new() -> Self {
        Wizform::default()
    }

    pub fn id(mut self, id: String) -> Self {
        self.id = id;
        self
    }

    pub fn model(mut self, model_id: String) -> Self {
        self.model = model_id;
        self
    }

    pub fn name(mut self, name_id: String) -> Self {
        self.name = name_id;
        self
    }

    pub fn desc(mut self, desc_id: String) -> Self {
        self.desc = desc_id;
        self
    }

    pub fn element(mut self, element: u8) -> Self {
        self.element = WizformElementType::from_repr(element).unwrap_or_default();
        self
    }

    pub fn magics(mut self, magics: Vec<Magic>) -> Self {
        self.magics = magics;
        self
    }

    pub fn number(mut self, number: u16) -> Self {
        self.number = number;
        self
    }

    pub fn hitpoints(mut self, hp: i32) -> Self {
        self.hitpoints = hp;
        self
    }

    pub fn agility(mut self, agility: i32) -> Self {
        self.agility = agility;
        self
    }

    pub fn jump_ability(mut self, jump: i32) -> Self {
        self.jump_ability = jump;
        self
    }

    pub fn precision(mut self, precision: i32) -> Self {
        self.precision = precision;
        self
    }

    pub fn evolution_form(mut self, evo_form_number: i32) -> Self {
        self.evolution_form = evo_form_number;
        self
    }

    pub fn evolution_level(mut self, evo_level: i32) -> Self {
        self.evolution_level = evo_level;
        self
    }

    pub fn voice(mut self, voice: i32) -> Self {
        self.voice_type = voice;
        self
    }

    pub fn exp_modifier(mut self, modifier: i32) -> Self {
        self.exp_modifier = modifier;
        self
    }
}