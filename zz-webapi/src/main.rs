use core::{book::book_routes, element::elements_routes, utils::ApiManager, wizform::wizform_routes};

use async_graphql::{http::GraphiQLSource, Context, EmptyMutation, EmptySubscription, Object, Schema};
use async_graphql_axum::GraphQL;
use axum::{extract::State, response::{Html, IntoResponse}, routing::{get, post}, Router};
use sea_orm::{Database, DatabaseConnection, SqlxPostgresConnector};
use services::{test::model::Graph, wizform::{self, service::WizformService}};
use uuid::Uuid;
//use core::{book::book_routes, element::elements_routes, utils::ApiManager, wizform::wizform_routes};

mod core;
mod services;
mod graphql;

async fn hello_world() -> &'static str {
    "Hello, world!"
}

pub struct Query;

#[Object]
impl Query {
    async fn howdy(&self) -> &'static str {
        "partner"
    }

    async fn graphs<'a>(
        &self, 
        context: &Context<'a>,
        #[graphql(desc = "Graph id")]
        id: Option<i32>,
        // #[graphql(desc = "Graph name")]
        // name: Option<String>,
        // #[graphql(desc = "Graph count")]
        // count: Option<i32>
    ) -> Result<Option<Vec<Graph>>, String> {
        let pool = context.data::<sqlx::PgPool>().unwrap();
        let res: Result<Vec<Graph>, sqlx::Error> = sqlx::query_as(r#"
            SELECT * FROM graphs;
        "#)
        .fetch_all(pool)
        .await;

        match res {
            Ok(graphs) => {
                Ok(Some(graphs))
            },
            Err(error) => {
                Err(error.to_string())
            }
        }
    }

    async fn enabled_wizforms<'a>(
        &self,
        context: &Context<'a>,
        #[graphql(desc = "Book this wizform belongs to")]
        book_id: Uuid
    ) -> Result<Option<Vec<wizform::models::wizform::Model>>, String> {
        let service = context.data::<WizformService>().unwrap();
        let db = context.data::<DatabaseConnection>().unwrap();
        let wizforms = service.get_wizforms(book_id, db).await;
        match wizforms {
            Ok(wizforms) => {
                Ok(wizforms)
            },
            Err(error) => {
                Err(error)
            }
        }
    }

    async fn graph_by_id<'a>(
        &self,
        context: &Context<'a>,
        #[graphql(desc = "Graph id")]
        id: Option<i32>
    ) -> Result<Option<Vec<Graph>>, String> {
        let pool = context.data::<sqlx::PgPool>().unwrap();
        let res: Result<Vec<Graph>, sqlx::Error> = sqlx::query_as(r#"
            SELECT * FROM graphs 
            WHERE (CASE when $1 is not null then (id=$1) else (id=id) end)
        "#)
        .bind(id)
        .fetch_all(pool)
        .await;

        match res {
            Ok(graphs) => {
                Ok(Some(graphs))
            },
            Err(error) => {
                Err(error.to_string())
            }
        } 
    }
}

async fn graphiql() -> impl IntoResponse {
    Html(
        GraphiQLSource::build().endpoint("/").subscription_endpoint("/ws").finish(),
    )
}

#[shuttle_runtime::main]
async fn main(
    #[shuttle_shared_db::Postgres] pool: sqlx::PgPool,
    //#[shuttle_shared_db::Postgres] db: sqlx::PgPool,
    #[shuttle_runtime::Secrets] secrets: shuttle_runtime::SecretStore
) -> shuttle_axum::ShuttleAxum {
    let manager = ApiManager {
        pool: pool.clone()
    };
    let db = SqlxPostgresConnector::from_sqlx_postgres_pool(pool);
    let schema = Schema::build(Query, EmptyMutation, EmptySubscription)
        .data(db)
        .data(WizformService {})
        .finish();
    tracing::info!("Tracing ok?");

    let router = Router::new()
        .route("/", get(graphiql).post_service(GraphQL::new(schema.clone())))
        .merge(wizform_routes())
        .merge(elements_routes())
        .merge(book_routes())
        .with_state(manager);

    Ok(router.into())
}
