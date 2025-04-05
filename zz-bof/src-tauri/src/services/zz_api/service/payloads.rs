use uuid::Uuid;

use crate::services::prelude::{BooksQueryArguments, ElementsQueryArguments, WizformElementType, WizformListArguments};

pub struct GetBooks {
    pub available: Option<bool>
}

impl From<GetBooks> for BooksQueryArguments {
    fn from(value: GetBooks) -> Self {
        BooksQueryArguments { available: value.available }
    }
}

#[derive(Debug, Default)]
pub struct GetWizformsList {
    pub book_id: Uuid,
    pub enabled: Option<bool>,
    pub element: Option<WizformElementType>,
    pub name: Option<String>
}

impl GetWizformsList {
    pub fn new(book_id: Uuid) -> Self {
        GetWizformsList { 
            book_id, 
            ..Default::default()
        }
    }

    pub fn enabled(mut self, enabled: Option<bool>) -> Self {
        self.enabled = enabled;
        self
    } 

    pub fn with_element(mut self, element: Option<WizformElementType>) -> Self {
        self.element = element;
        self
    } 

    pub fn with_name(mut self, name: Option<String>) -> Self {
        self.name = name;
        self
    } 
}

impl From<GetWizformsList> for WizformListArguments {
    fn from(value: GetWizformsList) -> Self {
        WizformListArguments { 
            book_id: cynic::Id::from(value.book_id), 
            enabled: value.enabled, 
            element_filter: value.element, 
            name_filter: value.name
        }
    }
}

#[derive(Debug, Default)]
pub struct GetElements {
    pub book_id: Uuid,
    pub enabled: Option<bool>
}


impl GetElements {
    pub fn new(id: Uuid) -> Self {
        GetElements { 
            book_id: id, 
            ..Default::default() 
        }        
    }

    pub fn enabled(mut self, enabled: Option<bool>) -> Self {
        self.enabled = enabled;
        self
    }
}

impl From<GetElements> for ElementsQueryArguments {
    fn from(value: GetElements) -> Self {
        ElementsQueryArguments { id: cynic::Id::from(value.book_id), enabled: value.enabled }
    }
}