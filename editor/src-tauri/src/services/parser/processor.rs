use std::path::PathBuf;
use base64::Engine;
use encoding_rs::WINDOWS_1251;
use itertools::Itertools;
use uuid::Uuid;

use crate::{app::prelude::{ParsedScript, RosterScript}, error::ZZParserError, services::prelude::{EvolutionListItem, EvolutionsList, ItemInputModel, LocationEntryInputModel, WizformElementType, WizformInputModel, WizformSimpleModel, WizformsMapLocation}};

use super::{plugins::prelude::{DescPluginType, NamePlugin, NamePluginType}, prelude::DescPlugin, reader::ZanzarahFileReader, utils::*};

const ICON_DIMENSIONS: u32 = 40;

pub struct ParseProcessor<'a> {
    texts: Vec<ZanzarahTextItem>,
    name_plugins: &'a Vec<NamePluginType>,
    desc_plugins: &'a Vec<DescPluginType>
}

impl<'a> ParseProcessor<'a> {

    pub fn new(name_plugins: &'a Vec<NamePluginType>, desc_plugins: &'a Vec<DescPluginType>) -> Self {
        ParseProcessor { texts: vec![], name_plugins, desc_plugins }
    }

    pub fn parse_texts(&mut self, directory: PathBuf) -> Result<(), ZZParserError> {
        let mut reader = ZanzarahFileReader::new(directory.join("Data\\_fb0x02.fbs"))?;
        let count = reader.read_int_with_skip(0)?;
        for _ in 0..count {
            let id = reader.read_int_with_skip(12)?;
            let content_length = reader.read_int_with_skip(0)?;
            let content = reader.read_bytes_with_skip((content_length - 1).try_into()?)?;
            let (content_decoded, _encoding, _error) = WINDOWS_1251.decode(content);
            let actual_content = content_decoded.to_string();
            reader.read_bytes_with_skip(13)?;
            let text_type = reader.read_int_with_skip(12)?;
            let mark = reader.read_string_with_skip(0)?;
            self.texts.push(ZanzarahTextItem {
                id: int_to_le_hex_string(id),
                content_length,
                content: actual_content,
                text_type,
                mark
            });
        }
        Ok(())
    }

    pub fn parse_scripts(
        &mut self, 
        directory: PathBuf, 
        locations: &[WizformsMapLocation], 
        scripts: &[RosterScript],
        wizforms: &[WizformSimpleModel]
    ) -> Result<Vec<LocationEntryInputModel>, ZZParserError> {
        let mut entries_to_insert = vec![];
        for location in locations {
            if let Some(game_number) = &location.game_number {
                let mut already_used_numbers_for_location = vec![];
                let scn_data = std::fs::read(directory.join(format!("Resources\\Worlds\\sc_{game_number}.scn")))?;
                let hex_string = hex::encode(&scn_data);
                for i in 0..81 {
                    let k = if i < 10 {
                        format!("0{i}")
                    } else {
                        i.to_string()
                    };
                    let roster = format!("a458{k}90");
                    if hex_string.contains(&roster) {
                        let roster = roster.to_uppercase();
                        // println!("Found roster: {roster}");
                        if let Some(roster_script) = scripts.iter().find(|s| s.id == roster) {
                            for line in roster_script.script.lines() {
                                if line.starts_with("'.0") {
                                    let elements = line.split(".").collect_vec();
                                    let wizform_number = elements[2].parse::<i32>()?;
                                    if !already_used_numbers_for_location.contains(&wizform_number) {
                                        let wizform_id = &wizforms.iter().find(|w| w.number == wizform_number).unwrap().id;
                                        already_used_numbers_for_location.push(wizform_number);
                                        entries_to_insert.push(LocationEntryInputModel {
                                            location_id: location.id.clone(),
                                            wizform_id: wizform_id.clone()
                                        });
                                    }   
                                }
                            }
                        }
                    }
                }
            }
        }
        println!("Found entries count: {}", entries_to_insert.len());
        Ok(entries_to_insert)
    }

    pub fn parse_wizforms(&mut self, directory: PathBuf, book_id: Uuid) -> Result<Vec<WizformInputModel>, ZZParserError> {
        let mut reader = ZanzarahFileReader::new(directory.join("Data\\_fb0x01.fbs"))?;
        // configure icons saving
        let icons_path = directory.join("Resources\\Bitmaps\\WIZ000T.BMP");
        let icons_save_path = std::env::current_exe()?
            .parent()
            .map(|m| m.join(format!("{}\\", &book_id)))
            .ok_or(ZZParserError::PathNotExists("icons save".to_string()))?;
        std::fs::create_dir_all(&icons_save_path)?;
        let icons_set = bmp::open(icons_path)?;

        let mut parsed_wizforms = vec![];

        let count = reader.read_int_with_skip(0)?;
        for _ in 0..count {
            let id = reader.read_int_with_skip(16)?;
            let _model = reader.read_string_with_skip(12)?;
            // parse name bytes
            let name_id = int_to_le_hex_string(reader.read_int_with_skip(8)?);
            let mut name = self.texts.iter()
                .find(|text| text.id == name_id)
                .ok_or(ZZParserError::UnknownTextId(name_id.clone()))?
                .content.clone();
            self.apply_name_plugins(&mut name);
            reader.read_int_with_skip(4)?;
            let element = reader.read_int_with_skip(14)?;
            let number = reader.read_smallint_with_skip(4)?;
            reader.read_int_with_skip(8)?;
            // parse magics bytes
            let mut magics = vec![];
            for i in 0..10 {
                reader.read_bytes_with_skip(12)?;
                let n = reader.read_int_with_skip(0)?;
                magics.push(MagicParsed::construct(i, n)?);
            }
            let magics_converted = parsed_magics_into_db_model(magics);
            // parse desc bytes
            reader.read_bytes_with_skip(4)?;
            reader.read_int_with_skip(4)?;
            let desc_id = int_to_le_hex_string(reader.read_int_with_skip(8)?);
            let desc = self.texts.iter()
                .find(|text| text.id == desc_id)
                .ok_or(ZZParserError::UnknownTextId(desc_id.clone()))?
                .content.clone();
            let desc = self.apply_desc_plugins(desc);
            // parse attributes
            reader.read_int_with_skip(4)?;
            let hitpoints = reader.read_int_with_skip(4)?;
            reader.read_int_with_skip(4)?;
            let evolution_form = reader.read_int_with_skip(4)?;
            reader.read_int_with_skip(4)?;
            let evolution_level = reader.read_int_with_skip(4)?;
            reader.read_int_with_skip(4)?;
            let agility = reader.read_int_with_skip(4)?;
            reader.read_int_with_skip(4)?;
            let jump_ability = reader.read_int_with_skip(4)?;
            reader.read_int_with_skip(4)?;
            let precision = reader.read_int_with_skip(4)?;
            reader.read_int_with_skip(4)?;
            let _voice = reader.read_int_with_skip(4)?;
            for _i in 0..3 {
                reader.read_int_with_skip(4)?;
            }
            reader.read_int_with_skip(12)?;
            let exp_modifier = reader.read_int_with_skip(12)?;
            reader.read_int_with_skip(0)?;
            // configure icon 
            let mut image = bmp::Image::new(ICON_DIMENSIONS, ICON_DIMENSIONS);
            for (x, y) in image.coordinates() {
                let offset = x + 40 * (number as u32);
                let pixel = icons_set.get_pixel(offset, y + 1);
                image.set_pixel(x, y, pixel);
            }
            let image_path = icons_save_path.join(format!("{number}.bmp"));
            let mut image64_repr = String::new();
    
            if image.save(&image_path).is_ok() {
                image64_repr = base64::prelude::BASE64_STANDARD.encode(std::fs::read(image_path)?);
            }

            parsed_wizforms.push(WizformInputModel {
                id: Uuid::new_v4().into(),
                book_id: book_id.into(),
                game_id: int_to_le_hex_string(id),
                element: WizformElementType::from_repr(element)
                    .ok_or(ZZParserError::UnknownEnumRepr { enum_type: "WizformElementType".to_string(), value: element })?,
                magics: magics_converted,
                number: number.into(),
                hitpoints,
                agility: if agility == 5 { 0 } else { agility + 1 },
                jump_ability: if jump_ability == 5 { 0 } else { jump_ability + 1 },
                precision: if precision == 5 { 0 } else { precision + 1 },
                evolution_form,
                evolution_name: None,
                previous_form: None,
                previous_form_name: None,
                evolution_level,
                exp_modifier,
                enabled: true,
                icon64: image64_repr,
                name,
                description: desc
            });
        }

        let wizforms_cloned = parsed_wizforms.clone();

        for wizform in parsed_wizforms.iter_mut() {
            wizform.evolution_name = self.get_wizform_name_by_number(&wizforms_cloned, wizform.evolution_form);
            if let Some(previous) = wizforms_cloned.iter()
                .find(|w| w.evolution_form == wizform.number) 
            {
                wizform.previous_form = Some(previous.number);
                wizform.previous_form_name = self.get_wizform_name_by_number(&wizforms_cloned, previous.number);
            }
        }

        Ok(parsed_wizforms)
    }

    fn apply_name_plugins(&mut self, name: &mut String) {
        for plugin in self.name_plugins {
            match plugin {
                NamePluginType::NullDetector(null_detector) => {
                    null_detector.apply(name);
                },
                NamePluginType::SymbolResolver(symbol_resolver) => {
                    symbol_resolver.apply(name);
                }
            }
        }
    }

    fn apply_desc_plugins(&mut self, desc: String) -> String {
        let mut answer = desc;
        for plugin in self.desc_plugins {
            match plugin {
                DescPluginType::DescCleaner(desc_cleaner) => {
                    answer = desc_cleaner.apply(answer);
                }
            }
        }
        answer
    }

    fn get_wizform_name_by_number(&self, wizforms: &[WizformInputModel], number: i32) -> Option<String> {
        wizforms.iter().find(|w| w.number == number).map(|wizform| wizform.name.clone())
    }

    pub fn parse_items(&self, directory: PathBuf, scripts: &[ParsedScript], items_ids: &[String], book_id: Uuid) -> Result<Vec<ItemInputModel>, ZZParserError> {
        let icons_path = directory.join("Resources\\Bitmaps\\ITM000T.BMP");
        let icons_save_path = std::env::current_exe()?
            .parent()
            .map(|m| m.join(format!("{}\\items\\", &book_id)))
            .ok_or(ZZParserError::PathNotExists("items icons save".to_string()))?;
        std::fs::create_dir_all(&icons_save_path)?;
        let icons_set = bmp::open(icons_path)?;
        let items_scripts = scripts.iter()
            .filter(|s| items_ids.iter().any(|id| int_to_le_hex_string(s.id) == *id))
            .collect_vec();

        let mut items = vec![];
        items_scripts.iter()
            .for_each(|is| {
                let mut is_reading = false;
                let mut current_target = -1;
                let mut current_produced = -1;
                let mut evolutions = vec![];
                for line in is.script.lines() {
                    if line.starts_with("D") {
                        is_reading = true;
                        current_target = line.split(".").last().unwrap().parse::<i32>().unwrap();
                    }
                    if line.starts_with(";.") && is_reading {
                        println!("Line: {}", &line);
                        if let Ok(value) = line.split(".").last().unwrap().parse::<i32>() {
                            current_produced = value;
                        } else {
                            is_reading = false;
                        }
                    }
                    if line.starts_with("7") && is_reading {
                        is_reading = false;
                        evolutions.push(EvolutionListItem { from: current_target, to: current_produced });
                    }
                }
                let name_id = int_to_le_hex_string(is.name_id.unwrap());
                let name = self.texts.iter()
                    .find(|text| text.id == name_id)
                    .ok_or(ZZParserError::UnknownTextId(name_id.clone()))
                    .unwrap()
                    .content.clone();
                let mut image = bmp::Image::new(ICON_DIMENSIONS, ICON_DIMENSIONS);
                for (x, y) in image.coordinates() {
                    let offset = x + 40 * (is.number.unwrap() as u32);
                    let pixel = icons_set.get_pixel(offset, y + 1);
                    image.set_pixel(x, y, pixel);
                }
                let image_path = icons_save_path.join(format!("{}.bmp", &name));
                let mut image64_repr = String::new();
        
                if image.save(&image_path).is_ok() {
                    image64_repr = base64::prelude::BASE64_STANDARD.encode(std::fs::read(image_path).unwrap());
                }
                items.push(ItemInputModel {
                    book_id: book_id.into(),
                    name,
                    icon64: image64_repr,
                    evolutions: EvolutionsList { items: evolutions }
                });
            });

        Ok(items)
    }
}