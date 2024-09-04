use std::fmt::format;

use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Magic {
    pub level: u16,
    pub slot: u8,
    pub first_element: u8,
    pub second_element: u8,
    pub third_element: u8,
    pub passive: bool
}

impl Magic {
    pub fn new(m: i32, n: i32) -> Magic {
        if n == -1 {
            Magic {
                level: 0, 
                slot: 0,
                first_element: 0,
                second_element: 0,
                third_element: 0,
                passive: false
            }
        }
        else {
            let magics_hex = format!("{:#010x}", n); 
            let magics_entities: Vec<&str> = magics_hex.split("").collect(); 
            let level_string = format!("{}{}", &magics_entities[5], &magics_entities[6]);
            let slot_string = format!("{}", &magics_entities[7]);
            let first_element_string = format!("{}", &magics_entities[8]);
            let second_element_string = format!("{}", &magics_entities[9]);
            let third_element_string = format!("{}", &magics_entities[10]);
            let level = u16::from_str_radix(&level_string, 16).unwrap();
            let slot = u8::from_str_radix(&slot_string, 16).unwrap() + 1;
            let first_element = u8::from_str_radix(&first_element_string, 16).unwrap();
            let second_element = u8::from_str_radix(&second_element_string, 16).unwrap();
            let third_element = u8::from_str_radix(&third_element_string, 16).unwrap();
            Magic {
                level: level,
                slot: slot,
                first_element: first_element,
                second_element: second_element,
                third_element: third_element,
                passive: slot % 2 == 0
            }
        }
    }
}