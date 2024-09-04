// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::io::{Read, Write};

use binary_reader::BinaryReader;
use encoding_rs::WINDOWS_1251;
use serde::{Deserialize, Serialize};
use utf16string::WString;
use zz_data::core::{magic::Magic, wizform::Wizform};

fn main() {
    let mut texts = vec![];
    read_texts(&mut texts);
    test(&texts);
    zz_parser_lib::run()
}

pub fn to_le_hex_string(i: i32) -> String {
    let bytes = i.to_le_bytes();
    format!("{:X}", i32::from_be_bytes(bytes))
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ZZText {
    id: String,
    content_length: i32,
    content: String,
    text_type: i32,
    mark: String
}

pub fn read_texts(texts: &mut Vec<ZZText>) {
    let path = std::env::current_dir().unwrap().join("_fb0x02.fbs");
    let mut file = std::fs::File::open(path).unwrap();
    let mut reader = BinaryReader::from_file(&mut file);
    reader.set_endian(binary_reader::Endian::Little);
    // test one
    let mut ss = String::new();
    for i in &reader.data {
        ss += &format!("{} ", i);
    }
    let test_path = std::env::current_dir().unwrap().parent().unwrap().join("test2.txt");
    let mut test_file = std::fs::File::create(test_path).unwrap();
    test_file.write_all(&mut ss.as_bytes()).unwrap();
    //
    let count = reader.read_i32().unwrap();
    println!("Texts count is {}", count);
    for _ in 0..count {
        let id = reader.read_i32().unwrap();
        //println!("Text id is {}", to_le_hex_string(id));
        reader.read_bytes(12).unwrap();
        let content_length = reader.read_i32().unwrap();
        //println!("Content length is {}", content_length);
        let content = reader.read_bytes((content_length - 1).try_into().unwrap()).unwrap();
        let (content_decoded, _encoding, _error) = WINDOWS_1251.decode(content);
        let actual_content = content_decoded.to_string();
        //let content = reader.read_cstr().unwrap();
        //println!("Content is {}", &content_decoded);
        reader.read_bytes(13).unwrap();
        let text_type = reader.read_i32().unwrap();
        //println!("Type is {}", text_type);
        reader.read_bytes(8).unwrap();
        let mark_length = reader.read_i32().unwrap();
        let mark = reader.read_cstr().unwrap();
        //println!("Mark is {:?}", &mark);
        texts.push(ZZText { 
            id: to_le_hex_string(id), 
            content_length: content_length, 
            content: actual_content, 
            text_type: text_type, 
            mark: mark
        });
    }

    let out_path = std::env::current_dir().unwrap().parent().unwrap().join("test.json");
    let mut out_file = std::fs::File::create(out_path).unwrap();
    let s = serde_json::to_string_pretty(&texts).unwrap();
    out_file.write_all(&mut s.as_bytes()).unwrap();
}

pub fn test(texts: &Vec<ZZText>) {
    let path = std::env::current_dir().unwrap().join("_fb0x01.fbs");
    let mut file = std::fs::File::open(path).unwrap();
    let mut reader = BinaryReader::from_file(&mut file);
    // bytes are represented in little endian order
    reader.set_endian(binary_reader::Endian::Little);
    // first 4 bytes is wizforms count
    let count = reader.read_u32().unwrap();
    let mut wizforms = vec![];
    println!("Wizforms count: {}", count);
    for _ in 0..count {
        let mut wizform = Wizform::default();
        // id + 16 bytes skip(12 useless bytes + 4 bytes for model string length)
        let id = reader.read_i32().unwrap();
        wizform.id = to_le_hex_string(id);
        reader.read_bytes(16).unwrap();
        // model name + 12 bytes skip
        let model = reader.read_cstr().unwrap();
        wizform.model = model;
        reader.read_bytes(12).unwrap();
        // name + 8 bytes skip
        let name_id = reader.read_i32().unwrap();
        let name = texts.iter()
            .find(|t| {
                t.id == to_le_hex_string(name_id)
            })
            .unwrap()
            .content.clone();
        wizform.name = name;
        reader.read_bytes(8).unwrap();
        // litter + 4 bytes skip.
        let _litter_0 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // element + 14 bytes skip
        let element = reader.read_i32().unwrap();
        wizform.element = element;
        reader.read_bytes(14).unwrap();
        // number + 4 bytes skip(in original build was 1 byte, but global requires 2 bytes)
        let number = reader.read_u16().unwrap();
        wizform.number = number;
        reader.read_bytes(4).unwrap();
        // litter + 8 bytes skip
        let _litter_1 = reader.read_i32().unwrap();
        reader.read_bytes(8).unwrap();
        // magics + 4 bytes skip
        for i in 0..10 {
            // skip 12 bytes
            reader.read_bytes(12).unwrap();
            let n =  reader.read_i32().unwrap();
            wizform.magics.push(Magic::new(i, n));
        }
        reader.read_bytes(4).unwrap();
        // litter + 4 bytes skip
        let _litter_2 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // description + 8 bytes skip.
        let desc_id = reader.read_i32().unwrap();
        let desc = texts.iter()
            .find(|t| {
                t.id == to_le_hex_string(desc_id)
            })
            .unwrap()
            .content.clone();
        wizform.desc = desc;
        reader.read_bytes(8).unwrap();
        // litter 3
        let _litter_3 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // hp + 4 bytes skip
        let hit_points = reader.read_i32().unwrap();
        wizform.hitpoints = hit_points;
        reader.read_bytes(4).unwrap();
        // litter 4
        let _litter_4 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // evo form + 4 bytes skip
        let evolution_form_number = reader.read_i32().unwrap();
        wizform.evolution_form = evolution_form_number;
        reader.read_bytes(4).unwrap();
        // litter 5
        let _litter_5 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap(); 
        // evo level + 4 bytes skip
        let evolution_level = reader.read_i32().unwrap();
        wizform.evolution_level = evolution_level;
        reader.read_bytes(4).unwrap();
        // litter 6
        let _litter_6 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // agility + 4 bytes skip
        let agility = reader.read_i32().unwrap();
        wizform.agility = agility + 1;
        reader.read_bytes(4).unwrap();
        // litter 7
        let _litter_7 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // jump ability + 4 bytes skip
        let jump_ability = reader.read_i32().unwrap();
        wizform.jump_ability = jump_ability + 1;
        reader.read_bytes(4).unwrap();
        // litter 8
        let _litter_8 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // precision + 4 bytes skip 
        let precision = reader.read_i32().unwrap();
        wizform.precision = precision + 1;
        reader.read_bytes(4).unwrap();
        // litter 9
        let _litter_9 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // voice + 4 bytes skip
        let voice = reader.read_i32().unwrap();
        wizform.voice_type = voice;
        reader.read_bytes(4).unwrap();
        // litter 10
        let _litter_10 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // litter 11
        let _litter_11 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // litter 12
        let _litter_12 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // litter 13
        let _litter_13 = reader.read_i32().unwrap();
        reader.read_bytes(12).unwrap();
        // exp modifier
        let exp_modifier = reader.read_i32().unwrap();
        wizform.exp_modifier = exp_modifier;
        // skip 12
        reader.read_bytes(12).unwrap();
        // litter 13
        let _litter_13 = reader.read_i32().unwrap();
        wizforms.push(wizform);
    }

    let out_path = std::env::current_dir().unwrap().parent().unwrap().join("wizforms.json");
    let mut out_file = std::fs::File::create(out_path).unwrap();
    let s = serde_json::to_string_pretty(&wizforms).unwrap();
    out_file.write_all(&mut s.as_bytes()).unwrap();
}