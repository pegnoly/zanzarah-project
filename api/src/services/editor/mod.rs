use sea_orm::DatabaseConnection;
use tonic::{Request, Response, Status};
use shared_gen::editor_service::{editor_service_server, GetWizformsRequest, GetWizformsResponse, HealthcheckRequest, HealthcheckResponse, UpdateWizformRequest, UpdateWizformResponse};

pub struct EditorServiceImpl {
    db: DatabaseConnection
}

impl EditorServiceImpl {
    pub fn new(db: DatabaseConnection) -> Self {
        Self { db }
    }
}

#[tonic::async_trait]
impl editor_service_server::EditorService for EditorServiceImpl {
    async fn healthcheck(&self, request: Request<HealthcheckRequest>) -> Result<Response<HealthcheckResponse>, Status> {
        Ok(Response::new(HealthcheckResponse {
            message: String::from("Editor service alive")
        }))
    }

    async fn get_wizforms(&self, request: Request<GetWizformsRequest>) -> Result<Response<GetWizformsResponse>, Status> {
        todo!()
    }

    async fn update_wizform(&self, request: Request<UpdateWizformRequest>) -> Result<Response<UpdateWizformResponse>, Status> {
        todo!()
    }
}