use async_graphql::{Context, Object};

use crate::Query;

#[derive(Debug, sqlx::FromRow, Clone)]
pub struct Graph {
    id: i32,
    name: String,
    count: i32
}

#[Object]
impl Graph {
    async fn id(&self) -> i32 {
        self.id
    }

    async fn name(&self) -> String {
        self.name.clone()
    }

    async fn count(&self) -> i32 {
        self.count
    }
}
