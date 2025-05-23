use super::models::{
    book::{self, BookFullModel, BookModel},
    collection, collection_entry,
    element::{self, ElementModel},
    wizform::{self, WizformElementType, WizformModel, WizformUpdateModel},
};
use crate::{error::ZZApiError, services::book::models::wizform::CollectionWizform};
use sea_orm::{
    ActiveModelTrait,
    ActiveValue::Set,
    ColumnTrait, Condition, DatabaseConnection, DbErr, EntityTrait, IntoActiveModel, ModelTrait,
    PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, Related, TransactionTrait,
    prelude::Expr,
    sea_query::{OnConflict, SimpleExpr},
};
use uuid::Uuid;

pub struct BookRepository;

impl BookRepository {
    pub async fn get_wizforms(
        &self,
        book_id: Uuid,
        enabled: Option<bool>,
        element: Option<WizformElementType>,
        name: &Option<String>,
        collection: Option<Uuid>,
        db: &DatabaseConnection,
    ) -> Result<Vec<CollectionWizform>, ZZApiError> {
        let condition = Condition::all()
            .add_option(enabled.map(|enabled| Expr::col(wizform::Column::Enabled).eq(enabled)))
            .add_option(if let Some(element) = element {
                if element != WizformElementType::None {
                    Some(Expr::col(wizform::Column::Element).eq(element))
                } else {
                    None::<SimpleExpr>
                }
            } else {
                None::<SimpleExpr>
            });

        let collection_condition = Condition::all().add_option(collection.map(|collection| {
            Expr::col(collection_entry::Column::CollectionId)
                .eq(collection)
                .or(collection_entry::Column::CollectionId.is_null())
        }));

        tracing::info!("Collection specified: {:?}", &collection);
        let result = wizform::Entity::find()
            .left_join(collection_entry::Entity)
            .column_as(collection_entry::Column::WizformId, "in_collection_id")
            .filter(collection_condition)
            .filter(wizform::Column::BookId.eq(book_id))
            .filter(condition)
            .filter(wizform::Column::Name.contains(name.clone().unwrap_or("".to_string())))
            .order_by(wizform::Column::Number, sea_orm::Order::Asc)
            .into_model::<CollectionWizform>()
            .all(db)
            .await;
        match result {
            Ok(res) => {
                tracing::info!("Found models: {:#?}", &res);
                Ok(res)
            }
            Err(error) => {
                tracing::error!("Error: {}", &error);
                Err(ZZApiError::SeaOrmError(error))
            }
        }
    }

    pub async fn get_wizform(
        &self,
        id: Uuid,
        db: &DatabaseConnection,
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
        db: &DatabaseConnection,
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
        available: Option<bool>,
    ) -> Result<Vec<BookModel>, ZZApiError> {
        let condition = Condition::all().add_option(
            available.map(|available| Expr::col(book::Column::Available).eq(available)),
        );

        Ok(book::Entity::find().filter(condition).all(db).await?)
    }

    pub async fn get_current_book(
        &self,
        db: &DatabaseConnection,
        id: Uuid,
    ) -> Result<Option<BookFullModel>, ZZApiError> {
        if let Some(book) = book::Entity::find_by_id(id).one(db).await? {
            let wizforms_count = wizform::Entity::find()
                .filter(wizform::Column::BookId.eq(id))
                .count(db)
                .await?;
            let active_wizforms_count = wizform::Entity::find()
                .filter(wizform::Column::BookId.eq(id))
                .filter(wizform::Column::Enabled.eq(true))
                .count(db)
                .await?;
            Ok(Some(BookFullModel {
                id: book.id,
                name: book.name,
                version: book.version,
                compatible_with: book.compatible_with,
                wizforms_count: wizforms_count as i32,
                active_wizforms_count: active_wizforms_count as i32,
            }))
        } else {
            Ok(None)
        }
    }

    pub async fn insert_wizforms_bulk(
        &self,
        db: &DatabaseConnection,
        wizforms: Vec<WizformModel>,
    ) -> Result<(), ZZApiError> {
        let transaction = db.begin().await?;
        for wizform in wizforms {
            let on_conflict = OnConflict::new()
                .exprs([
                    Expr::column(wizform::Column::BookId),
                    Expr::column(wizform::Column::Number),
                ])
                .update_columns([
                    wizform::Column::Element,
                    wizform::Column::Magics,
                    wizform::Column::Name,
                    wizform::Column::Hitpoints,
                    wizform::Column::Agility,
                    wizform::Column::JumpAbility,
                    wizform::Column::Precision,
                    wizform::Column::EvolutionForm,
                    wizform::Column::EvolutionName,
                    wizform::Column::PreviousForm,
                    wizform::Column::PreviousFormName,
                    wizform::Column::EvolutionLevel,
                    wizform::Column::ExpModifier,
                    wizform::Column::Description,
                    wizform::Column::Icon64,
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
                icon64: Set(wizform.icon64),
            };
            wizform::Entity::insert(model_to_insert)
                .on_conflict(on_conflict)
                .exec(db)
                .await?;
            //}
        }
        transaction.commit().await?;
        Ok(())
    }

    pub async fn update_wizform(
        &self,
        db: &DatabaseConnection,
        update_model: WizformUpdateModel,
    ) -> Result<(), ZZApiError> {
        if let Some(existing_model) = wizform::Entity::find_by_id(update_model.id.parse::<Uuid>()?)
            .one(db)
            .await?
        {
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
            Err(ZZApiError::SeaOrmError(DbErr::RecordNotFound(
                "No record for wizform supposed to be updated".to_string(),
            )))
        }
    }

    pub async fn create_collection(
        &self,
        db: &DatabaseConnection,
        user_id: i32,
        book_id: Uuid,
        version: String,
        name: String,
        description: String,
    ) -> Result<(), ZZApiError> {
        let model_to_insert = collection::ActiveModel {
            id: Set(Uuid::new_v4()),
            user_id: Set(user_id),
            book_id: Set(book_id),
            created_on_version: Set(version),
            name: Set(name),
            description: Set(description),
            ..Default::default()
        };
        model_to_insert.insert(db).await?;
        Ok(())
    }

    pub async fn get_active_collection_for_user(
        &self,
        db: &DatabaseConnection,
        user_id: i32,
        book_id: Uuid,
    ) -> Result<Option<collection::Model>, ZZApiError> {
        Ok(collection::Entity::find()
            .filter(collection::Column::UserId.eq(user_id))
            .filter(collection::Column::BookId.eq(book_id))
            .filter(collection::Column::Active.eq(true))
            .one(db)
            .await?)
    }

    pub async fn get_collections_for_user(
        &self,
        db: &DatabaseConnection,
        user_id: i32,
        book_id: Uuid,
    ) -> Result<Vec<collection::Model>, ZZApiError> {
        Ok(collection::Entity::find()
            .filter(collection::Column::UserId.eq(user_id))
            .filter(collection::Column::BookId.eq(book_id))
            .all(db)
            .await?)
    }

    pub async fn set_active_collection(
        &self,
        db: &DatabaseConnection,
        id: Uuid,
    ) -> Result<(), ZZApiError> {
        if let Some(existing_model) = collection::Entity::find_by_id(id).one(db).await? {
            if let Some(current_active_model) = collection::Entity::find()
                .filter(collection::Column::UserId.eq(existing_model.user_id))
                .filter(collection::Column::BookId.eq(existing_model.book_id))
                .filter(collection::Column::Active.eq(true))
                .one(db)
                .await?
            {
                let mut current_model_to_update = current_active_model.into_active_model();
                current_model_to_update.active = Set(false);
                current_model_to_update.update(db).await?;
            }
            let mut model_to_update = existing_model.into_active_model();
            model_to_update.active = Set(true);
            model_to_update.update(db).await?;
        }
        Ok(())
    }

    pub async fn add_item_to_collection(
        &self,
        db: &DatabaseConnection,
        collection_id: Uuid,
        wizform_id: Uuid,
    ) -> Result<Uuid, ZZApiError> {
        let id = Uuid::new_v4();
        let model_to_insert = collection_entry::ActiveModel {
            id: Set(id),
            collection_id: Set(collection_id),
            wizform_id: Set(wizform_id),
        };
        model_to_insert.insert(db).await?;
        Ok(id)
    }

    pub async fn remove_item_from_collection(
        &self,
        db: &DatabaseConnection,
        id: Uuid,
    ) -> Result<(), ZZApiError> {
        if let Some(model_to_delete) = collection_entry::Entity::find_by_id(id)
            .one(db)
            .await?
        {
            model_to_delete.delete(db).await?;
        }
        Ok(())
    }
}
