use reqwest::Client;
use serde::{Deserialize, Serialize};
use tauri::async_runtime::RwLock;
use zz_data::core::{magic::{Magic, MagicSlotType}, wizform::WizformDBModel};

pub struct LocalAppManager {
    pub client: RwLock<Client>
}

impl LocalAppManager {
    pub fn new() -> Self {
        LocalAppManager { 
            client: RwLock::new(Client::new())
        }
    }
}



#[derive(Debug, Serialize, Deserialize, Clone, Copy, Default)]
pub struct MagicFrontendModel {
    pub first_element: i32,
    pub second_element: i32,
    pub third_element: i32
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy, Default)]
pub struct LevelOfMagicFrontendModel {
    pub level: u8,
    pub first_active_slot: MagicFrontendModel,
    pub first_passive_slot: MagicFrontendModel,
    pub second_active_slot: MagicFrontendModel,
    pub second_passive_slot: MagicFrontendModel
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WizformMobileFrontendModel {
    pub id: String,
    pub name: String,
    pub element: i32,
    pub magics: Vec<LevelOfMagicFrontendModel>,
    pub number: i16,
    pub hitpoints: i32,
    pub agility: i32,
    pub jump_ability: i32,
    pub precision: i32,
    pub evolution_form: i32,
    pub evolution_level: i32,
    pub exp_modifier: i32,
    pub enabled: bool,
    pub filters: Vec<i32>
}

impl From<&WizformDBModel> for WizformMobileFrontendModel {
    fn from(value: &WizformDBModel) -> Self {
        let magics: Vec<Magic> = serde_json::from_str(&value.magics).unwrap();
        let converted_magics = convert_magics(magics);
        WizformMobileFrontendModel { 
            id: value.id.clone(), 
            name: value.name.clone(), 
            element: value.element.clone() as i32, 
            magics: converted_magics, 
            number: value.number, 
            hitpoints: value.hitpoints, 
            agility: value.agility, 
            jump_ability: value.jump_ability, 
            precision: value.precision, 
            evolution_form: value.evolution_form, 
            evolution_level: value.evolution_level, 
            exp_modifier: value.exp_modifier, 
            enabled: value.enabled, 
            filters: value.filters.clone() 
        }
    }
}

pub fn convert_magics(db_magics: Vec<Magic>) -> Vec<LevelOfMagicFrontendModel> {
    let mut converted_magics: Vec<LevelOfMagicFrontendModel> = vec![];
    let mut previous = LevelOfMagicFrontendModel::default();

    for magic in db_magics.into_iter() {
        let mut converted_magic = previous;
        converted_magic.level = magic.level as u8;
        match (magic.slot_type, magic.slot_number) {
            (MagicSlotType::Active, 1) => {
                converted_magic.first_active_slot = MagicFrontendModel {
                    first_element: magic.first_element as i32,
                    second_element: magic.second_element as i32,
                    third_element: magic.third_element as i32
                }
            },
            (MagicSlotType::Active, 2) => {
                converted_magic.second_active_slot = MagicFrontendModel {
                    first_element: magic.first_element as i32,
                    second_element: magic.second_element as i32,
                    third_element: magic.third_element as i32
                }
            },
            (MagicSlotType::Passive, 1) => {
                converted_magic.first_passive_slot = MagicFrontendModel {
                    first_element: magic.first_element as i32,
                    second_element: magic.second_element as i32,
                    third_element: magic.third_element as i32
                }
            },
            (MagicSlotType::Passive, 2) => {
                converted_magic.second_passive_slot = MagicFrontendModel {
                    first_element: magic.first_element as i32,
                    second_element: magic.second_element as i32,
                    third_element: magic.third_element as i32
                }
            },
            _=> {}
        }
        previous = converted_magic;
        converted_magics.push(converted_magic);
    }
    converted_magics
}