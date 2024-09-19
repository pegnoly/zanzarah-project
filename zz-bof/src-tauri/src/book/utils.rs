use std::collections::HashMap;

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
    pub desc: String,
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
    pub filters: Vec<i32>,
    pub spawn_points: Vec<String>,
    pub icon: String
}

pub fn convert_to_mobile_model(db_model: &WizformDBModel, icons_map: &HashMap<i16, String>) -> WizformMobileFrontendModel {
    let magics: Vec<Magic> = serde_json::from_str(&db_model.magics).unwrap();
    let converted_magics = convert_magics(magics);
    let actual_name = String::from_utf8(db_model.name.clone()).unwrap();
    let actual_icon = icons_map.get(&db_model.number).unwrap();
    WizformMobileFrontendModel { 
        id: db_model.id.clone(),
        name: actual_name,
        desc: db_model.description.clone(),
        element: db_model.element.clone() as i32, 
        magics: converted_magics, 
        number: db_model.number, 
        hitpoints: db_model.hitpoints, 
        agility: db_model.agility, 
        jump_ability: db_model.jump_ability, 
        precision: db_model.precision, 
        evolution_form: db_model.evolution_form, 
        evolution_level: db_model.evolution_level, 
        exp_modifier: db_model.exp_modifier, 
        enabled: db_model.enabled, 
        filters: db_model.filters.clone(),
        spawn_points: db_model.spawn_points.clone(),
        icon: actual_icon.clone()
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
            (MagicSlotType::Active, 3) => {
                converted_magic.second_active_slot = MagicFrontendModel {
                    first_element: magic.first_element as i32,
                    second_element: magic.second_element as i32,
                    third_element: magic.third_element as i32
                }
            },
            (MagicSlotType::Passive, 2) => {
                converted_magic.first_passive_slot = MagicFrontendModel {
                    first_element: magic.first_element as i32,
                    second_element: magic.second_element as i32,
                    third_element: magic.third_element as i32
                }
            },
            (MagicSlotType::Passive, 4) => {
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