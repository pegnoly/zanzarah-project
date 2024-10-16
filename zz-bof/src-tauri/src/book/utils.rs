use std::{collections::HashMap, path::PathBuf};

use reqwest::Client;
use serde::{Deserialize, Serialize};
use sqlx::{Pool, Sqlite};
use tauri::async_runtime::RwLock;
use uuid::Uuid;
use zz_data::core::{magic::{Magic, MagicSlotType}, wizform::{ElementDBModel, WizformDBModel}};

pub struct LocalAppManager {
    pub client: RwLock<Client>,
    pub app_data_path: RwLock<Option<PathBuf>>,
    pub local_pool: RwLock<Option<Pool<Sqlite>>>
}

impl LocalAppManager {
    pub fn new() -> Self {
        LocalAppManager { 
            client: RwLock::new(Client::new()),
            app_data_path: RwLock::new(None),
            local_pool: RwLock::new(None)
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone, Copy, Default)]
pub struct MagicFrontendModel {
    pub first_element: i16,
    pub second_element: i16,
    pub third_element: i16
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
    // pub id: Uuid,
    pub name: String,
    pub desc: String,
    pub element: i16,
    pub magics: Vec<LevelOfMagicFrontendModel>,
    pub number: i16,
    pub hitpoints: i16,
    pub agility: i16,
    pub jump_ability: i16,
    pub precision: i16,
    pub evolution_form: i16,
    pub evolution_level: i16,
    pub exp_modifier: i16,
    // pub enabled: bool,
    // pub filters: Vec<i32>,
    // pub spawn_points: Vec<String>,
    // pub icon: String
}

#[derive(Debug, Serialize, Deserialize, sqlx::FromRow)]
pub struct WizformLocalDBModel {
    pub id: String,
    pub book_id: String,
    pub name: String,
    pub description: String,
    pub icon: String,
    pub element: i32,
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
    pub filters: String,
    pub spawn_points: String
}

impl From<WizformDBModel> for WizformMobileFrontendModel {
    fn from(value: WizformDBModel) -> Self {
        let converted_magics = convert_magics(value.magics.types.clone());
        let actual_name = String::from_utf8(value.name.clone()).unwrap();
        WizformMobileFrontendModel { 
            //id: value.id.clone(),
            name: actual_name,
            desc: value.description.clone(),
            element: value.element.clone() as i16, 
            magics: converted_magics, 
            number: value.number, 
            hitpoints: value.hitpoints, 
            agility: value.agility, 
            jump_ability: value.jump_ability, 
            precision: value.precision, 
            evolution_form: value.evolution_form, 
            evolution_level: value.evolution_level, 
            exp_modifier: value.exp_modifier, 
            // enabled: value.enabled, 
            // icon: value.icon64.clone()
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WizformMobileFrontendSimpleModel {
    pub id: Uuid,
    pub name: String,
    pub element: i16,
    pub icon: String,
    pub number: i16,
    pub enabled: bool
}

impl From<WizformDBModel> for WizformMobileFrontendSimpleModel {
    fn from(value: WizformDBModel) -> Self {
        WizformMobileFrontendSimpleModel {
            id: value.id,
            name: String::from_utf8(value.name).unwrap(),
            element: value.element as i16,
            number: value.number,
            icon: value.icon64,
            enabled: value.enabled
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ElementFrontendModel {
    pub id: Uuid,
    pub element: i16,
    pub name: String,
    pub enabled: bool
}

impl From<ElementDBModel> for ElementFrontendModel {
    fn from(value: ElementDBModel) -> Self {
        ElementFrontendModel {
            id: value.id,
            name: value.name,
            element: value.element as i16,
            enabled: value.enabled
        }
    }
}

// impl From<&WizformLocalDBModel> for WizformMobileFrontendModel {
//     fn from(value: &WizformLocalDBModel) -> Self {
//         let magics: Vec<Magic> = serde_json::from_str(&value.magics).unwrap();
//         let converted_magics = convert_magics(magics);
//         WizformMobileFrontendModel { 
//             id: value.id.clone(),
//             name: value.name.clone(),
//             desc: value.description.clone(),
//             element: value.element, 
//             magics: converted_magics, 
//             number: value.number, 
//             hitpoints: value.hitpoints, 
//             agility: value.agility, 
//             jump_ability: value.jump_ability, 
//             precision: value.precision, 
//             evolution_form: value.evolution_form, 
//             evolution_level: value.evolution_level, 
//             exp_modifier: value.exp_modifier, 
//             enabled: value.enabled, 
//             filters: serde_json::from_str(&value.filters).unwrap(),
//             spawn_points: serde_json::from_str(&value.spawn_points).unwrap(),
//             icon: value.icon.clone()
//         }   
//     }
// }

pub fn convert_magics(db_magics: Vec<Magic>) -> Vec<LevelOfMagicFrontendModel> {
    let mut converted_magics: Vec<LevelOfMagicFrontendModel> = vec![];
    let mut previous = LevelOfMagicFrontendModel::default();

    for magic in db_magics.into_iter() {
        let mut converted_magic = previous;
        converted_magic.level = magic.level as u8;
        match (magic.slot_type, magic.slot_number) {
            (MagicSlotType::Active, 1) => {
                converted_magic.first_active_slot = MagicFrontendModel {
                    first_element: magic.first_element as i16,
                    second_element: magic.second_element as i16,
                    third_element: magic.third_element as i16
                }
            },
            (MagicSlotType::Active, 3) => {
                converted_magic.second_active_slot = MagicFrontendModel {
                    first_element: magic.first_element as i16,
                    second_element: magic.second_element as i16,
                    third_element: magic.third_element as i16
                }
            },
            (MagicSlotType::Passive, 2) => {
                converted_magic.first_passive_slot = MagicFrontendModel {
                    first_element: magic.first_element as i16,
                    second_element: magic.second_element as i16,
                    third_element: magic.third_element as i16
                }
            },
            (MagicSlotType::Passive, 4) => {
                converted_magic.second_passive_slot = MagicFrontendModel {
                    first_element: magic.first_element as i16,
                    second_element: magic.second_element as i16,
                    third_element: magic.third_element as i16
                }
            },
            _=> {}
        }
        previous = converted_magic;
        converted_magics.push(converted_magic);
    }
    converted_magics
}