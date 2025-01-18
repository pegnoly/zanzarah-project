use sea_orm::{ColumnTrait, DatabaseConnection, EntityTrait, QueryFilter};
use sqlx::PgPool;
use uuid::Uuid;

use super::models::wizform;

pub struct WizformService;

impl WizformService {
    pub async fn get_wizforms(&self, book_id: Uuid, db: &DatabaseConnection) -> Result<Option<Vec<wizform::Model>>, String> {
        let res = wizform::Entity::find()
            .filter(wizform::Column::BookId.eq(book_id))
            .filter(wizform::Column::Enabled.eq(true))
            .all(db)
            .await;

        match res {
            Ok(wizforms) => {
                Ok(Some(wizforms))
            },
            Err(error) => {
                Err(error.to_string())
            }
         }
    }
}