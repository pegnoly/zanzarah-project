use sea_orm::{prelude::Expr, sea_query::SimpleExpr, ColumnTrait, Condition, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};
use uuid::Uuid;

use crate::error::ZZApiError;

use super::models::{book::{self, BookModel}, element::{self, ElementModel}, wizform::{self, WizformElementType, WizformModel}};

pub struct WizformService;

impl WizformService {

    pub async fn get_wizforms(
        &self, 
        book_id: Uuid, 
        enabled: Option<bool>,
        element: Option<WizformElementType>,
        name: &Option<String>,  
        db: &DatabaseConnection
    ) -> Result<Vec<WizformModel>, ZZApiError> {
        let condition = Condition::all()
            .add_option(
                enabled.map(|enabled| Expr::col(wizform::Column::Enabled).eq(enabled))
            )
            .add_option(
                if let Some(element) = element {
                    if element != WizformElementType::None {
                        Some(Expr::col(wizform::Column::Element).eq(element)) 
                    } else {
                        None::<SimpleExpr>
                    }
                } else {
                    None::<SimpleExpr> 
                }
            );

        Ok(wizform::Entity::find()
            .filter(wizform::Column::BookId.eq(book_id))
            .filter(condition)
            .filter(wizform::Column::ClearedName.contains(name.clone().unwrap_or("".to_string())))
            .order_by(wizform::Column::Number, sea_orm::Order::Asc)
            .all(db)
            .await?)
    }

    pub async fn get_wizform(
        &self,
        id: Uuid,
        db: &DatabaseConnection
    ) -> Result<Option<WizformModel>, ZZApiError> {
        Ok(wizform::Entity::find()
            .filter(wizform::Column::Id.eq(id))
            .one(db)
            .await?)
    }

    pub async fn get_elements(
        &self,
        book_id: Uuid,
        enabled: Option<bool>,
        db: &DatabaseConnection
    ) -> Result<Vec<ElementModel>, ZZApiError> {
        let condition = Condition::all()
            .add_option(enabled.map(|enabled| Expr::col(element::Column::Enabled).eq(enabled)));
        
        Ok(element::Entity::find()
            .filter(element::Column::BookId.eq(book_id))
            .filter(condition)
            .all(db)
            .await?)
    }

    pub async fn get_books(
        &self, 
        db: &DatabaseConnection,
        available: Option<bool>
    ) -> Result<Vec<BookModel>, ZZApiError> {
        let condition = Condition::all()
        .add_option(
            available.map(|available| Expr::col(book::Column::Downloadable).eq(available))
        );

        Ok(book::Entity::find()
            .filter(condition)
            .all(db)
            .await?)
    }
}