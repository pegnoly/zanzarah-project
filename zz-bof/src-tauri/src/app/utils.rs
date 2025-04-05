use tokio::sync::{Mutex, RwLock};
use uuid::Uuid;

use crate::services::prelude::WizformListModel;

pub struct LocalDataContainer {
    pub current_book: Mutex<Option<Uuid>>,
    pub wizforms: RwLock<Vec<WizformListModel>>
}