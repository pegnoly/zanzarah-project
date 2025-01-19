use sea_orm::{prelude::Expr, sea_query::SimpleExpr, ColumnTrait, Condition, DatabaseConnection, EntityTrait, QueryFilter, QueryOrder};
use uuid::Uuid;

use super::models::{element::{self, ElementModel}, wizform::{self, WizformElementType, WizformModel}};

pub struct WizformService;

impl WizformService {

    pub async fn get_wizforms(
        &self, 
        book_id: Uuid, 
        enabled: Option<bool>,
        element: Option<WizformElementType>,
        name: Option<String>,  
        db: &DatabaseConnection
    ) -> Result<Option<Vec<WizformModel>>, String> {
        let condition = Condition::all()
            .add_option(
                if enabled.is_some() { 
                    Some(Expr::col(wizform::Column::Enabled).eq(enabled.unwrap())) 
                } else { None::<SimpleExpr> 
                }
            )
            .add_option(
                if element.is_some() && element.unwrap() != WizformElementType::None { 
                    Some(Expr::col(wizform::Column::Element).eq(element.unwrap())) 
                } else { 
                    None::<SimpleExpr> 
                }
            );

        let res = wizform::Entity::find()
            .filter(wizform::Column::BookId.eq(book_id))
            .filter(condition)
            .filter(wizform::Column::ClearedName.contains(name.unwrap_or("".to_string())))
            .order_by(wizform::Column::Number, sea_orm::Order::Asc)
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

    pub async fn get_elements(
        &self,
        book_id: Uuid,
        enabled: Option<bool>,
        db: &DatabaseConnection
    ) -> Result<Option<Vec<ElementModel>>, String> {
        let condition = Condition::all()
            .add_option(if enabled.is_some() { Some(Expr::col(element::Column::Enabled).eq(enabled.unwrap())) } else { None::<SimpleExpr>});
        
        let res = element::Entity::find()
            .filter(element::Column::BookId.eq(book_id))
            .filter(condition)
            .all(db)
            .await;

        match res {
            Ok(elements) => {
                Ok(Some(elements))
            },
            Err(error) => {
                Err(error.to_string())
            }
        }
    }
}