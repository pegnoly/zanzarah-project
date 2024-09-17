use serde::{Deserialize, Serialize};
use strum::{Display, EnumIter, FromRepr};

use crate::book::base::WizformFilterType;

use super::magic::Magic;

#[derive(Debug, Serialize, Default, Deserialize, FromRepr, Display, EnumIter, Clone, sqlx::Type)]
#[repr(i32)]
pub enum WizformElementType {
    #[strum(to_string = "Нейтральная стихия 1")]
    NeutralOne = 0,
    #[default]
    #[strum(to_string = "Природа")]
    Nature = 1,
    #[strum(to_string = "Воздух")]
    Air = 2,
    #[strum(to_string = "Вода")]
    Water = 3,
    #[strum(to_string = "Свет")]
    Light = 4,
    #[strum(to_string = "Энергия")]
    Energy = 5,
    #[strum(to_string = "Пси")]
    Psi = 6,
    #[strum(to_string = "Камень")]
    Stone = 7,
    #[strum(to_string = "Лёд")]
    Ice = 8,
    #[strum(to_string = "Огонь")]
    Fire = 9,
    #[strum(to_string = "Тьма")]
    Dark = 10,
    #[strum(to_string = "Хаос")]
    Chaos = 11,
    #[strum(to_string = "Металл")]
    Metall = 12,
    #[strum(to_string = "Нейтральная стихия 2")]
    NeutralTwo = 13,
    #[strum(to_string = "Пользовательская стихия 1")]
    Custom1 = 14,
    #[strum(to_string = "Пользовательская стихия 2")]
    Custom2 = 15,
    #[strum(to_string = "Пользовательская стихия 3")]
    Custom3 = 16,
    #[strum(to_string = "Пользовательская стихия 4")]
    Custom4 = 17,
    #[strum(to_string = "Пользовательская стихия 5")]
    Custom5 = 18
}

/// Represents a wizform parsed from the game files
#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Wizform {
    pub id: String,
    pub game_id: String,
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

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct WizformDBModel {
    pub id: String,
    pub book_id: String,
    pub game_id: String,
    pub name: String,
    pub description: String,
    pub icon64: String,
    pub element: WizformElementType,
    pub magics: String,
    pub number: i16,
    pub hitpoints: i32,
    pub agility: i32,
    pub jump_ability: i32,
    pub precision: i32,
    pub evolution_form: i32,
    pub evolution_level: i32,
    pub exp_modifier: i32,
    pub enabled: bool,
    pub filters: Vec<i32>,
    pub spawn_points: Vec<String>
}

#[derive(Debug, Serialize, Deserialize, Clone, sqlx::FromRow)]
pub struct WizformSpawnPoint {
    pub id: String,
    pub book_id: String,
    pub name: String
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WizformFrontendModel {
    pub id: String,
    pub name: String,
    pub desc: String,
    pub element: i32,
    pub enabled: bool,
    pub filters: Vec<i32>,
    pub spawn_points: Vec<String>,
    pub icon: String,
    pub number: i16
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct WizformElementModel {
    pub id: String,
    pub element: WizformElementType,
    pub name: String,
    pub book_id: String,
    pub enabled: bool
}

#[derive(Debug, Serialize, Deserialize)]
pub struct WizformElementFrontendModel {
    pub id: String,
    pub element: i32,
    pub name: String,
    pub enabled: bool
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
        self.element = WizformElementType::from_repr(element as i32).unwrap_or_default();
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