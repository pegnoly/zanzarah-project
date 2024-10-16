use std::path::PathBuf;

use base64::Engine;
use binary_reader::BinaryReader;
use encoding_rs::WINDOWS_1251;
use serde::de;
use tokio::sync::{Mutex, RwLock};
use uuid::Uuid;
use zz_data::core::{magic::Magic, text::Text, wizform::{Filters, Magics, SpawnPoints, Wizform, WizformDBModel, WizformElementType}};

use crate::parser::plugins::types::{DescCleaner, SymbolRemover};

use super::{commands::MAIN_URL, utils::to_le_hex_string};

pub struct ParseController {
    pub texts: RwLock<Vec<Text>>,
    pub wizforms: Mutex<Vec<Wizform>>
}

pub async fn parse_texts(directory: String, texts: &mut Vec<Text>) {
    let path = PathBuf::from(directory).join("Data\\_fb0x02.fbs");
    log::info!("Texts path: {:?}", &path);
    let mut file = std::fs::File::open(path).unwrap();
    let mut reader = BinaryReader::from_file(&mut file);
    reader.set_endian(binary_reader::Endian::Little);
    let count = reader.read_i32().unwrap();
    for _ in 0..count {
        let id = reader.read_i32().unwrap();
        reader.read_bytes(12).unwrap();
        let content_length = reader.read_i32().unwrap();
        let content = reader.read_bytes((content_length - 1).try_into().unwrap()).unwrap();
        // for some reason texts are encoded in this shit 
        let (content_decoded, _encoding, _error) = WINDOWS_1251.decode(content);
        let actual_content = content_decoded.to_string();
        reader.read_bytes(13).unwrap();
        let text_type = reader.read_i32().unwrap();
        reader.read_bytes(12).unwrap();
        let mark = reader.read_cstr().unwrap();
        texts.push(Text {
            id: to_le_hex_string(id),
            content_length: content_length,
            content: actual_content,
            text_type: text_type,
            mark: mark
        });
    }
}

pub async fn parse_wizforms(
    book_id: Uuid,
    directory: String, 
    texts: &Vec<Text>, 
    wizforms: &mut Vec<WizformDBModel>, 
    existing_wizforms: &Vec<WizformDBModel>
) {
    let path = PathBuf::from(&directory).join("Data\\_fb0x01.fbs");
    log::info!("Wizforms path: {:?}", &path);
    let mut file = std::fs::File::open(path).unwrap();
    let mut reader = BinaryReader::from_file(&mut file);
    // bytes are represented in little endian order
    reader.set_endian(binary_reader::Endian::Little);
    let icons_path = PathBuf::from(&directory).join("Resources\\Bitmaps\\WIZ000T.BMP");
    let icons_save_path = std::env::current_exe().unwrap().parent().unwrap().join(format!("{}\\", &book_id));
    let wizforms_icon = bmp::open(icons_path).unwrap();

    let desc_cleaner = DescCleaner {};
    let symbol_remover = SymbolRemover::new();

    // first 4 bytes is wizforms count
    let count = reader.read_u32().unwrap();
    for _ in 0..count {
        // id + 16 bytes skip(12 useless bytes + 4 bytes for model string length)
        let id = reader.read_i32().unwrap();
        reader.read_bytes(16).unwrap();
        // model name + 12 bytes skip
        let _model = reader.read_cstr().unwrap();
        reader.read_bytes(12).unwrap();
        // name + 8 bytes skip
        let name_id = reader.read_i32().unwrap();
        let mut name = texts.iter()
            .find(|t| {
                t.id == to_le_hex_string(name_id)
            })
            .unwrap()
            .content.clone();

        name = symbol_remover.apply(name);

        reader.read_bytes(8).unwrap();
        // litter + 4 bytes skip.
        let _litter_0 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // element + 14 bytes skip
        let element = reader.read_i32().unwrap();
        reader.read_bytes(14).unwrap();
        // number + 4 bytes skip(in original build was 1 byte, but global requires 2 bytes)
        let number = reader.read_u16().unwrap();
        reader.read_bytes(4).unwrap();
        // litter + 8 bytes skip
        let _litter_1 = reader.read_i32().unwrap();
        reader.read_bytes(8).unwrap();
        // magics + 4 bytes skip
        let mut magics = vec![];
        for i in 0..10 {
            // skip 12 bytes
            reader.read_bytes(12).unwrap();
            let n =  reader.read_i32().unwrap();
            magics.push(Magic::new(i, n));
        }
        reader.read_bytes(4).unwrap();
        // litter + 4 bytes skip
        let _litter_2 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // description + 8 bytes skip.
        let desc_id = reader.read_i32().unwrap();
        let mut desc = texts.iter()
            .find(|t| {
                t.id == to_le_hex_string(desc_id)
            })
            .unwrap()
            .content.clone();

        desc = desc_cleaner.apply(desc);

        reader.read_bytes(8).unwrap();
        // litter 3
        let _litter_3 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // hp + 4 bytes skip
        let hit_points = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // litter 4
        let _litter_4 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // evo form + 4 bytes skip
        let evolution_form_number = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // litter 5
        let _litter_5 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap(); 
        // evo level + 4 bytes skip
        let evolution_level = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // litter 6
        let _litter_6 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // agility + 4 bytes skip
        let agility = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // litter 7
        let _litter_7 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // jump ability + 4 bytes skip
        let jump_ability = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // litter 8
        let _litter_8 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // precision + 4 bytes skip 
        let precision = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // litter 9
        let _litter_9 = reader.read_i32().unwrap();
        reader.read_bytes(4).unwrap();
        // voice + 4 bytes skip
        let _voice = reader.read_i32().unwrap();
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
        // skip 12
        reader.read_bytes(12).unwrap();
        // litter 13
        let _litter_13 = reader.read_i32().unwrap();
        // ICON

        let mut image = bmp::Image::new(40, 40);
        for (x, y) in image.coordinates() {
            let offset = x + 40 * (number as u32);
            let pixel = wizforms_icon.get_pixel(offset, y + 1);
            image.set_pixel(x, y, pixel);
        }
        let image_path = icons_save_path.join(format!("{}.bmp", number));
        let mut image64_repr = String::new();

        match image.save(&image_path) {
            Ok(saved) => {
                image64_repr = base64::prelude::BASE64_STANDARD.encode(&std::fs::read(image_path).unwrap());
            },
            Err(save_error) => {

            }
        }

        // ICON
        
        log::info!("Wizform {} parsed successfully", &name);

        let hex_id = to_le_hex_string(id);
        let existing_wizform = existing_wizforms.iter()
            .find(|w| {
                w.game_id == hex_id
            });
        match existing_wizform {
            Some(wizform) => {
                wizforms.push(WizformDBModel { 
                    id: wizform.id, 
                    book_id: book_id, 
                    game_id: wizform.game_id.clone(), 
                    name: name.as_bytes().to_vec(), 
                    description: desc,
                    element: WizformElementType::from_repr(element as i16).unwrap(), 
                    magics: zz_data::json(Magics {
                        types: magics
                    }), 
                    number: number as i16, 
                    hitpoints: hit_points as i16, 
                    agility: agility as i16, 
                    jump_ability: jump_ability as i16, 
                    precision: precision as i16, 
                    evolution_form: evolution_form_number as i16, 
                    evolution_level: evolution_level as i16, 
                    exp_modifier: exp_modifier as i16,
                    enabled: wizform.enabled,
                    filters: wizform.filters.clone(),
                    spawn_points: wizform.spawn_points.clone(),
                    icon64: image64_repr
                });
            },
            None => {
                wizforms.push(WizformDBModel { 
                    id: uuid::Uuid::new_v4(),
                    book_id: book_id.clone(), 
                    game_id: hex_id, 
                    name: name.as_bytes().to_vec(), 
                    description: desc,
                    element: WizformElementType::from_repr(element as i16).unwrap(), 
                    magics: zz_data::json(Magics {
                            types: magics
                    }), 
                    number: number as i16, 
                    hitpoints: hit_points as i16, 
                    agility: if agility == 5 {0} else {(agility + 1) as i16}, 
                    jump_ability: if jump_ability == 5 {0} else {(jump_ability + 1) as i16}, 
                    precision: if precision == 5 {0} else {(precision + 1) as i16}, 
                    evolution_form: evolution_form_number as i16, 
                    evolution_level: evolution_level as i16, 
                    exp_modifier: exp_modifier as i16,
                    enabled: true,
                    filters: zz_data::json(Filters {
                        ids: vec![]
                    }),
                    spawn_points: zz_data::json(SpawnPoints {
                        ids: vec![]
                    }),
                    icon64: image64_repr
                });
            }
        }
    }
}

pub async fn upload_wizform_chunk(
    chunk: &Vec<WizformDBModel>, 
    client: &tokio::sync::RwLockReadGuard<'_, reqwest::Client>
) -> Result<(), ()> {
    let wizform_load_response = client.post(format!("{}/wizforms", MAIN_URL))
        .json(chunk)
        .send()
        .await;
    match wizform_load_response {
        Ok(response_ok) => {
            println!("Uploading wizforms response: {}", &response_ok.text().await.unwrap());
            Ok(())
        },
        Err(response_err) => {
            println!("Uploading wizforms response error: {}", &response_err.to_string());
            Err(())
        }
    }   
}