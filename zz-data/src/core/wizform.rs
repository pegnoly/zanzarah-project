use serde::{Deserialize, Serialize};

use super::magic::Magic;

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Wizform {
    pub id: String,
    pub model: String,
    pub name: String,
    pub desc: String,
    pub element: i32,
    pub magics: Vec<Magic>,
    pub number: u16,
    pub hitpoints: i32,
    pub agility: i32,
    pub jump_ability: i32,
    pub precision: i32,
    pub evolution_form: i32,
    pub evolution_level: i32,
    pub voice_type: i32,
    pub exp_modifier: i32
}