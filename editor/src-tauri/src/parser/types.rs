use serde::{Deserialize, Serialize};
use uuid::Uuid;
use zz_data::core::wizform::{ElementDBModel, WizformDBModel};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WizformFrontendSimpleModel {
    pub id: Uuid,
    pub name: String,
    pub element: i16,
    pub icon: String,
    pub number: i16
}

impl From<WizformDBModel> for WizformFrontendSimpleModel {
    fn from(value: WizformDBModel) -> Self {
        WizformFrontendSimpleModel {
            id: value.id,
            name: String::from_utf8(value.name).unwrap(),
            element: value.element as i16,
            number: value.number,
            icon: value.icon64
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct WizformFrontendFullModel {
    pub id: Uuid,
    pub name: String,
    pub element: i16,
    pub number: i16,
    pub enabled: bool,
    pub desc: String 
}

impl From<WizformDBModel> for WizformFrontendFullModel {
    fn from(value: WizformDBModel) -> Self {
        WizformFrontendFullModel {
            id: value.id,
            name: String::from_utf8(value.name).unwrap(),
            element: value.element as i16,
            number: value.number,
            desc: value.description,
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