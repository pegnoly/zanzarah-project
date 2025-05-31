use super::models::{
    book::{self, BookFullModel, BookModel}, collection::{self, CollectionFullModel}, collection_entry, element::{self, ElementModel}, location::{self, LocationNameModel, LocationWithEntriesCountModel}, location_section::{self, LocationSectionModel, LocationSectionWithCount}, location_wizform_entry::{self, LocationWizformEntryModel, LocationWizformFullEntry}, wizform::{self, WizformElementType, WizformModel, WizformSelectionModel, WizformUpdateModel}
};
use crate::{error::ZZApiError, services::book::models::wizform::CollectionWizform};
use itertools::Itertools;
use sea_orm::{
    prelude::Expr, sea_query::{OnConflict, SimpleExpr}, ActiveModelTrait, ActiveValue::Set, ColumnTrait, Condition, DatabaseConnection, DbErr, EntityTrait, FromQueryResult, IntoActiveModel, ModelTrait, PaginatorTrait, QueryFilter, QueryOrder, QuerySelect, Related, RelationTrait, SelectColumns, Statement, TransactionTrait
};
use uuid::Uuid;

pub struct BookRepository;

impl BookRepository {
    pub async fn get_wizforms(
        &self,
        book_id: Uuid,
        enabled: Option<bool>,
        element: Option<WizformElementType>,
        name: Option<String>,
        collection: Option<Uuid>,
        db: &DatabaseConnection,
    ) -> Result<Vec<CollectionWizform>, ZZApiError> {
        let query = CollectionWizform::find_by_statement(Statement::from_sql_and_values(sea_orm::DatabaseBackend::Postgres,
        r#"
                SELECT "w".*,
                    CASE 
                        WHEN "ce"."collection_id" = $1 THEN "ce"."id"
                        ELSE NULL
                    END AS "in_collection_id"
                FROM 
                    "wizforms" "w"
                LEFT JOIN 
                    "collection_entries" "ce" ON "w"."id" = "ce"."wizform_id" AND "ce"."collection_id" = $2
                WHERE
                    "book_id" = $3 and
                    "name" LIKE $4 and
                    "element" = $5 and
                    "enabled" = true
                ORDER BY 
                    "number"
            "#,
            [collection.into(), collection.into(), book_id.into(), 
                if name.is_some() { 
                    format!("%{}%", name.unwrap()).into() 
                } else {
                    '%'.into()
                }, 
                element.into()
            ]
            ));
        //tracing::info!("{:#?}", &query.into_json());

        let wizforms = query.all(db)
            .await?;
        Ok(wizforms)
    }

    pub async fn get_wizform(
        &self,
        id: Uuid,
        collection_id: Option<Uuid>,
        db: &DatabaseConnection,
    ) -> Result<Option<CollectionWizform>, ZZApiError> {
        let wizform = CollectionWizform::find_by_statement(Statement::from_sql_and_values(
            sea_orm::DatabaseBackend::Postgres, 
            r#"
            SELECT "w".*,
                CASE 
                    WHEN "ce"."collection_id" = $1 THEN "ce"."id"
                    ELSE NULL
                END AS "in_collection_id"
            FROM 
                "wizforms" "w"
            LEFT JOIN 
                "collection_entries" "ce" ON "w"."id" = "ce"."wizform_id" AND "ce"."collection_id" = $2
            WHERE
	            "w"."id" = $3"#, 
                [collection_id.into(), collection_id.into(), id.into()]))
            .one(db)
            .await?;
        Ok(wizform)
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
        user_id: Uuid,
        book_id: Uuid,
        name: String,
    ) -> Result<collection::Model, ZZApiError> {
        let book = book::Entity::find_by_id(book_id)
            .one(db)
            .await?
            .ok_or(ZZApiError::Custom("No book found with given id".to_string()))?;

        let model_to_insert = collection::ActiveModel {
            id: Set(Uuid::new_v4()),
            user_id: Set(user_id),
            book_id: Set(book_id),
            created_on_version: Set(book.version),
            name: Set(name),
            ..Default::default()
        };
        let model = model_to_insert.insert(db).await?;
        Ok(model)
    }

    pub async fn get_collections_for_user(
        &self,
        db: &DatabaseConnection,
        user_id: Uuid,
        book_id: Uuid,
    ) -> Result<Vec<collection::CollectionFullModel>, ZZApiError> {
        let collections = CollectionFullModel::find_by_statement(Statement::from_sql_and_values(
            sea_orm::DatabaseBackend::Postgres,
            r#"select "c".*, Count("ce"."id") as "entries_count" from "collections" "c" 
            left join "collection_entries" "ce" on ("ce"."collection_id" = "c"."id")
            where "book_id" = $1
            and "user_id" = $2
            group by "c"."id""#, [book_id.into(), user_id.into()]))
            .all(db)
            .await?;
        tracing::info!("Collections with entries found: {:#?}", &collections);
        Ok(collections)
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

    pub async fn get_active_collection_for_user(
        &self,
        db: &DatabaseConnection,
        user_id: Uuid,
        book_id: Uuid
    ) -> Result<Option<Uuid>, ZZApiError> {
        if let Some(existing_collection) = collection::Entity::find()
            .filter(collection::Column::BookId.eq(book_id))
            .filter(collection::Column::UserId.eq(user_id))
            .filter(collection::Column::Active.eq(true))
            .one(db)
            .await? 
        {
            Ok(Some(existing_collection.id))
        } else {
            Ok(None)
        }
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

    pub async fn get_entries_count(
        &self,
        db: &DatabaseConnection,
        collection_id: Uuid
    ) -> Result<u64, ZZApiError> {
        let count = collection::Entity::find()
            .left_join(collection_entry::Entity)
            .filter(collection::Column::Id.eq(collection_id))
            .count(db)
            .await?;
        Ok(count)
    }

    pub async fn get_locations_sections(
        &self,
        db: &DatabaseConnection,
        book_id: Uuid
    ) -> Result<Vec<LocationSectionWithCount>, ZZApiError> {
        let data = LocationSectionWithCount::find_by_statement(Statement::from_sql_and_values(
            sea_orm::DatabaseBackend::Postgres, 
        r#"
                SELECT "ls"."id", "ls"."name", COUNT("l"."id") as "locations_count" 
                FROM "location_sections" "ls"
                LEFT JOIN "locations" "l" on ("l"."section_id" = "ls"."id")
                WHERE "ls"."book_id" = $1
                GROUP BY "ls"."id"
                ORDER BY "ls"."ordering"
            "#, [book_id.into()]))
            .all(db)
            .await?;
        Ok(data)
    }

    pub async fn get_locations(
        &self,
        db: &DatabaseConnection,
        section_id: Uuid
    ) -> Result<Vec<LocationWithEntriesCountModel>, ZZApiError> {
        let data = LocationWithEntriesCountModel::find_by_statement(Statement::from_sql_and_values(
            sea_orm::DatabaseBackend::Postgres, 
        r#"
                SELECT "l"."id", "l"."name", COUNT("we"."id") AS "entries_count" 
                FROM "locations" "l"
                LEFT JOIN "location_wizform_entries" "we" ON ("l"."id" = "we"."location_id")
                WHERE "l"."section_id" = $1
                GROUP BY "l"."id"
                ORDER BY "l"."ordering"
            "#, [section_id.into()]))
            .all(db)
            .await?;
        Ok(data)
    }

    pub async fn get_location_wizforms(
        &self,
        db: &DatabaseConnection,
        location_id: Uuid
    ) -> Result<Vec<LocationWizformFullEntry>, ZZApiError> {
        let data = location_wizform_entry::Entity::find()
            .select_only()
            .columns([location_wizform_entry::Column::Id, location_wizform_entry::Column::Comment])
            .left_join(wizform::Entity)
            .column_as(wizform::Column::Name, "wizform_name")
            .column_as(wizform::Column::Number, "wizform_number")
            .column_as(wizform::Column::Element, "wizform_element")
            .filter(location_wizform_entry::Column::LocationId.eq(location_id))
            .into_model::<LocationWizformFullEntry>()
            .all(db)
            .await?;
        Ok(data)
    }

    pub async fn add_location_wizform(
        &self,
        db: &DatabaseConnection,
        location_id: Uuid,
        wizform_id: Uuid,
        comment: Option<String>
    ) -> Result<Uuid, ZZApiError> {
        let id = Uuid::new_v4();
        let model_to_insert = location_wizform_entry::ActiveModel {
            id: Set(id),
            location_id: Set(location_id),
            wizform_id: Set(wizform_id),
            comment: Set(comment)
        };
        model_to_insert.insert(db).await?;
        Ok(id)
    }

    pub async fn update_location_wizform_comment(
        &self,
        db: &DatabaseConnection,
        id: Uuid,
        new_comment: String
    ) -> Result<(), ZZApiError> {
        if let Some(existing_wizform) = location_wizform_entry::Entity::find_by_id(id).one(db).await? {
            let mut model_to_update = existing_wizform.into_active_model();
            model_to_update.comment = Set(if new_comment.is_empty() { None } else { Some(new_comment) });
            model_to_update.update(db).await?;
        } 
        Ok(())
    }

    pub async fn delete_location_wizform(
        &self,
        db: &DatabaseConnection,
        id: Uuid
    ) -> Result<(), ZZApiError> {
        if let Some(existing_wizform) = location_wizform_entry::Entity::find_by_id(id).one(db).await? {
            existing_wizform.delete(db).await?;
        }
        Ok(())
    }

    pub async fn get_wizforms_for_selection(
        &self,
        db: &DatabaseConnection,
        book_id: Uuid,
        // location_id: Uuid
    ) -> Result<Vec<WizformSelectionModel>, ZZApiError> {
        // let data = wizform::Entity::find()
        //     .left_join(location_wizform_entry::Entity)
        //     .filter(element_condition)
        //     .filter(name_condition)
        //     .filter(wizform::Column::Enabled.eq(true))
        //     .filter(location_wizform_entry::Column::Id.is_null())
        //     .select_only()
        //     .columns([wizform::Column::Id, wizform::Column::Name, wizform::Column::Element, wizform::Column::Number])
        //     .order_by_asc(wizform::Column::Number)
        //     .into_model::<WizformSelectionModel>()
        //     .all(db)
        //     .await?;

        let data = wizform::Entity::find()
            .select_only()
            .columns([wizform::Column::Id, wizform::Column::Name, wizform::Column::Element, wizform::Column::Number])
            .filter(wizform::Column::BookId.eq(book_id))
            .filter(wizform::Column::Enabled.eq(true))
            .into_model::<WizformSelectionModel>()
            .all(db)
            .await?;

        Ok(data)
    }

    pub async fn get_wizform_habitats(
        &self,
        db: &DatabaseConnection,
        wizform_id: Uuid
    ) -> Result<Vec<LocationNameModel>, ZZApiError> {
        let data = location_wizform_entry::Entity::find()
            .left_join(location::Entity)
            .column_as(location::Column::Name, "location_name")
            .join(sea_orm::JoinType::LeftJoin, location::Relation::Section.def())
            .column_as(location_section::Column::Name, "section_name")
            .filter(location_wizform_entry::Column::WizformId.eq(wizform_id))
            .order_by_asc(location_section::Column::Ordering)
            .order_by_asc(location::Column::Ordering)
            .into_model::<LocationNameModel>()
            .all(db)
            .await?;
        Ok(data)
    }
}