use serde::{Deserialize, Serialize};
use strum::FromRepr;

/// Possible magic elements. 
#[derive(Debug, Serialize, Deserialize, FromRepr)]
#[repr(u8)]
pub enum MagicElementType {
    None = 0,
    Nature = 1,
    Air = 2,
    Water = 3,
    Light = 4,
    Energy = 5,
    Psi = 6,
    Stone = 7,
    Ice = 8,
    Fire = 9,
    Dark = 10, 
    Chaos = 11,
    Metall = 12,
    Joker = 13,
    Error = 14
}

/// Possible types of wizform magic slot.
#[derive(Debug, Serialize, Deserialize)]
pub enum MagicSlotType {
    NotExist,
    Active,
    Passive
}

/// Represents wizform's magic level parsed from game files.
#[derive(Debug, Serialize, Deserialize)]
pub struct Magic {
    /// Level wizform must have to gain this magic
    pub level: u16,
    pub slot_type: MagicSlotType,
    pub slot_number: u8,
    pub first_element: MagicElementType,
    pub second_element: MagicElementType,
    pub third_element: MagicElementType
}

impl Magic {
    /// Creates new instance of Magic from parsed number in wizform file. Alghoritm by RustlessWarrior.
    pub fn new(_m: i32, n: i32) -> Magic {
        if n == -1 {
            Magic {
                level: 0,
                slot_type: MagicSlotType::NotExist, 
                slot_number: 0,
                first_element: MagicElementType::None,
                second_element: MagicElementType::None,
                third_element: MagicElementType::None
            }
        }
        else {
            let magics_hex = format!("{:#010x}", n); 
            let magics_entities: Vec<&str> = magics_hex.split("").collect(); 
            let level = u16::from_str_radix(&format!("{}{}", &magics_entities[5], &magics_entities[6]), 16).unwrap();
            let slot = u8::from_str_radix(&format!("{}", &magics_entities[7]), 16).unwrap() + 1;
            let first_element = u8::from_str_radix(&format!("{}", &magics_entities[8]), 16).unwrap();
            let second_element = u8::from_str_radix(&format!("{}", &magics_entities[9]), 16).unwrap();
            let third_element = u8::from_str_radix(&format!("{}", &magics_entities[10]), 16).unwrap();
            Magic {
                level: level,
                slot_number: slot,
                slot_type: if slot % 2 == 0 {MagicSlotType::Passive} else {MagicSlotType::Active},
                first_element: MagicElementType::from_repr(first_element).unwrap(),
                second_element: MagicElementType::from_repr(second_element).unwrap(),
                third_element: MagicElementType::from_repr(third_element).unwrap()
            }
        }
    }
}