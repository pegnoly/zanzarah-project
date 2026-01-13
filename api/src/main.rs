use std::net::SocketAddr;

// #![forbid(clippy::unwrap_used)]
use async_graphql::{EmptySubscription, Schema, http::GraphiQLSource};
use async_graphql_axum::GraphQL;
use axum::{
    Router,
    http::Method,
    response::{Html, IntoResponse},
    routing::get,
};
use graphql::{MutationRoot, QueryRoot};
use sea_orm::SqlxPostgresConnector;
use serde::{Deserialize, Serialize};
use services::{
    auth::prelude::AuthRepository, 
    book::repo::BookRepository
};
use sqlx::PgPool;
use tower_http::cors::{Any, CorsLayer};

mod error;
mod graphql;
mod services;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub email: String,
    pub password: String,
}

async fn graphiql() -> impl IntoResponse {
    Html(
        GraphiQLSource::build()
            .endpoint("/")
            .subscription_endpoint("/ws")
            .finish(),
    )
}

#[tokio::main]
async fn main() {
    let pool = PgPool::connect(
        "postgresql://postgres:AKWoBDghSAGvqKKjzFMUngcHMziyBdqU@interchange.proxy.rlwy.net:32808/postgres"
    )
        .await
        .unwrap();
    let db = SqlxPostgresConnector::from_sqlx_postgres_pool(pool);
    let schema = Schema::build(
        QueryRoot::default(),
        MutationRoot::default(),
        EmptySubscription,
    )
        .data(db)
        .data(BookRepository)
        .data(AuthRepository::new().unwrap())
        .finish();
    
    // Get the port number from the environment, default to 3000
    let port: u16 = std::env::var("PORT")
        .unwrap_or_else(|_| "3000".to_string()) // Get the port as a string or default to "3000"
        .parse() // Parse the port string into a u16
        .expect("Failed to parse PORT");

    // Create a socket address (IPv6 binding)
    let address = SocketAddr::from(([0, 0, 0, 0, 0, 0, 0, 0], port));
    let listener = tokio::net::TcpListener::bind(&address).await.unwrap();

    let router = Router::new()
        .route(
            "/",
            get(graphiql).post_service(GraphQL::new(schema.clone())),
        )
        .layer(
            CorsLayer::new()
                .allow_origin(Any)
                .allow_methods([
                    Method::GET,
                    Method::POST,
                    Method::PUT,
                    Method::DELETE,
                    Method::OPTIONS,
                ])
                .allow_headers(Any)
        );

    axum::serve(listener, router).await.unwrap()
}