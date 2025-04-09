use itertools::Itertools;
use serde::{Deserialize, Serialize};

use crate::{error::ZZParserError, services::prelude::{MagicElementType, MagicInputModel, MagicSlotInputModel, MagicsInputModel}};

/// Types only used during the process of parsing. No reasons to use them outside of it.

pub struct ZanzarahTextItem {
    pub id: String,
    pub content_length: i32,
    pub content: String,
    pub text_type: i32,
    pub mark: String
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum MagicSlotType {
    NotExist,
    Active,
    Passive
}

pub struct MagicParsed {
    pub level: u16,
    pub slot_type: MagicSlotType,
    pub slot_number: u8,
    pub first_element: MagicElementType,
    pub second_element: MagicElementType,
    pub third_element: MagicElementType
}

impl MagicParsed {
    pub fn construct(_m: i32, n: i32) -> Result<Self, ZZParserError> {
        if n == -1 {
            Ok(MagicParsed {
                level: 0,
                slot_type: MagicSlotType::NotExist, 
                slot_number: 0,
                first_element: MagicElementType::None,
                second_element: MagicElementType::None,
                third_element: MagicElementType::None
            })
        }
        else {
            let magics_hex = format!("{:#010x}", n); 
            let magics_entities = magics_hex.split("").collect_vec(); 
            let level = u16::from_str_radix(&format!("{}{}", &magics_entities[5], &magics_entities[6]), 16)?;
            let slot = u8::from_str_radix(&format!("{}", &magics_entities[7]), 16)? + 1;
            let first_element = u8::from_str_radix(&format!("{}", &magics_entities[8]), 16)?;
            let second_element = u8::from_str_radix(&format!("{}", &magics_entities[9]), 16)?;
            let third_element = u8::from_str_radix(&format!("{}", &magics_entities[10]), 16)?;
            Ok(MagicParsed {
                level,
                slot_number: slot,
                slot_type: if slot % 2 == 0 {MagicSlotType::Passive} else {MagicSlotType::Active},
                first_element: MagicElementType::from_repr(first_element)
                    .ok_or(ZZParserError::ParseMagic("Incorrect first element repr".to_string()))?,
                second_element: MagicElementType::from_repr(second_element)
                    .ok_or(ZZParserError::ParseMagic("Incorrect second element repr".to_string()))?,
                third_element: MagicElementType::from_repr(third_element)
                    .ok_or(ZZParserError::ParseMagic("Incorrect third element repr".to_string()))?,
            })
        }
    }
}

pub fn int_to_le_hex_string(i: i32) -> String {
    let bytes = i.to_le_bytes();
    format!("{:X}", i32::from_be_bytes(bytes))
}

pub fn parsed_magics_into_db_model(magics: Vec<MagicParsed>) -> MagicsInputModel {
    let mut converted_magics = vec![];
    let mut previous = MagicInputModel::default();

    for magic in magics.into_iter() {
        let mut converted_magic = previous;
        converted_magic.level = magic.level as i32;
        match (magic.slot_type, magic.slot_number) {
            (MagicSlotType::Active, 1) => {
                converted_magic.first_active_slot = MagicSlotInputModel {
                    first_element: magic.first_element,
                    second_element: magic.second_element,
                    third_element: magic.third_element
                }
            },
            (MagicSlotType::Active, 3) => {
                converted_magic.second_active_slot = MagicSlotInputModel {
                    first_element: magic.first_element,
                    second_element: magic.second_element,
                    third_element: magic.third_element
                }
            },
            (MagicSlotType::Passive, 2) => {
                converted_magic.first_passive_slot = MagicSlotInputModel {
                    first_element: magic.first_element,
                    second_element: magic.second_element,
                    third_element: magic.third_element
                }
            },
            (MagicSlotType::Passive, 4) => {
                converted_magic.second_passive_slot = MagicSlotInputModel {
                    first_element: magic.first_element,
                    second_element: magic.second_element,
                    third_element: magic.third_element
                }
            },
            _=> {}
        }
        previous = converted_magic.clone();
        converted_magics.push(converted_magic);
    }
    MagicsInputModel { types: converted_magics }
}