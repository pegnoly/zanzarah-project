use sea_orm::{prelude::Expr, sea_query::{OnConflict, SimpleExpr}, ActiveModelTrait, ActiveValue::Set, ColumnTrait, Condition, DatabaseConnection, DbErr, EntityTrait, IntoActiveModel, QueryFilter, QueryOrder, TransactionTrait};
use uuid::Uuid;

use crate::error::ZZApiError;

use super::models::{book::{self, BookModel}, element::{self, ElementModel}, wizform::{self, WizformElementType, WizformModel, WizformUpdateModel}};

pub struct BookRepository;

impl BookRepository {

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
            .filter(wizform::Column::Name.contains(name.clone().unwrap_or("".to_string())))
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

    pub async fn insert_wizforms_bulk(
        &self,
        db: &DatabaseConnection,
        wizforms: Vec<WizformModel>
    ) -> Result<(), ZZApiError> {
        let transaction = db.begin().await?;
        for wizform in wizforms {
            // if let Some(existing_model) = wizform::Entity::find_by_id(wizform.id).one(db).await? {
            //     let mut model_to_update: wizform::ActiveModel = existing_model.into();
            //     model_to_update.element = Set(wizform.element);
            //     model_to_update.magics = Set(wizform.magics);
            //     model_to_update.name = Set(wizform.name);
            //     model_to_update.hitpoints = Set(wizform.hitpoints);
            //     model_to_update.agility = Set(wizform.agility);
            //     model_to_update.jump_ability = Set(wizform.jump_ability);
            //     model_to_update.precision = Set(wizform.precision);
            //     model_to_update.evolution_form = Set(wizform.evolution_form);
            //     model_to_update.evolution_name = Set(wizform.evolution_name);
            //     model_to_update.previous_form = Set(wizform.previous_form);
            //     model_to_update.previous_form_name = Set(wizform.previous_form_name);
            //     model_to_update.evolution_level = Set(wizform.evolution_level);
            //     model_to_update.exp_modifier = Set(wizform.exp_modifier);
            //     model_to_update.enabled = Set(wizform.enabled);
            //     model_to_update.description = Set(wizform.description);
            //     model_to_update.icon64 = Set(wizform.icon64);
            //     model_to_update.update(db).await?;
            // } else {
            let on_conflict = OnConflict::new()
                .exprs([
                    Expr::column(wizform::Column::BookId),
                    Expr::column(wizform::Column::Number)
                ])
                .update_columns([
                    wizform::Column::Element, wizform::Column::Magics, wizform::Column::Name, wizform::Column::Hitpoints, 
                    wizform::Column::Agility, wizform::Column::JumpAbility, wizform::Column::Precision, wizform::Column::EvolutionForm, 
                    wizform::Column::EvolutionName, wizform::Column::PreviousForm, wizform::Column::PreviousFormName, wizform::Column::EvolutionLevel, 
                    wizform::Column::ExpModifier, wizform::Column::Enabled, wizform::Column::Description, wizform::Column::Icon64
                ])
                .to_owned();
            let model_to_insert = wizform::ActiveModel {
                id: Set(wizform.id),
                book_id: Set(wizform.book_id),
                game_id: Set(wizform.game_id),
                element: Set(wizform.element),
                magics: Set(wizform.magics),
                name: Set(wizform.name),
                number: Set(wizform.number),
                hitpoints: Set(wizform.hitpoints),
                agility: Set(wizform.agility),
                jump_ability: Set(wizform.jump_ability),
                precision: Set(wizform.precision),
                evolution_form: Set(wizform.evolution_form),
                evolution_name: Set(wizform.evolution_name),
                previous_form: Set(wizform.previous_form),
                previous_form_name: Set(wizform.previous_form_name),
                evolution_level: Set(wizform.evolution_level),
                exp_modifier: Set(wizform.exp_modifier),
                enabled: Set(wizform.enabled),
                description: Set(wizform.description),
                icon64: Set(wizform.icon64)
            };
            wizform::Entity::insert(model_to_insert).on_conflict(on_conflict).exec(db).await?;
            //}
        }
        transaction.commit().await?;
        Ok(())
    }

    pub async fn update_wizform(
        &self,
        db: &DatabaseConnection,
        update_model: WizformUpdateModel
    ) -> Result<(), ZZApiError> {
        if let Some(existing_model) = wizform::Entity::find_by_id(update_model.id.parse::<Uuid>()?).one(db).await? {
            let mut model_to_update = existing_model.into_active_model();
            if let Some(element) = update_model.element {
                model_to_update.element = Set(element);
            }
            if let Some(enabled) = update_model.enabled {
                model_to_update.enabled = Set(enabled);
            }
            if let Some(name) = update_model.name {
                model_to_update.name = Set(name);
            }
            if let Some(desc) = update_model.description {
                model_to_update.description = Set(desc);
            }
            model_to_update.update(db).await?;
            Ok(())
        } else {
            Err(ZZApiError::SeaOrmError(DbErr::RecordNotFound("No record for wizform supposed to be updated".to_string())))
        }
    }
}