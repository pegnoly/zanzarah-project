use ::chrono::TimeDelta;
use mail_send::{SmtpClientBuilder, mail_builder::MessageBuilder};
use sea_orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait,
    IntoActiveModel, QueryFilter,
};
use shuttle_runtime::SecretStore;
use totp_rs::TOTP;

use crate::error::ZZApiError;

use super::models::user::{
    self, ActiveConfirmationInfo, ConfirmationCodeInfo, ConfirmationState, PermissionType,
    Permissions,
};

#[derive(Debug, Clone)]
pub struct EmailConfig {
    sender: String,
    host: String,
    email: String,
    password: String,
}

pub struct AuthRepository {
    email_config: EmailConfig,
}

impl AuthRepository {
    pub fn new(secrets: &SecretStore) -> Result<Self, ZZApiError> {
        Ok(AuthRepository {
            email_config: EmailConfig {
                sender: secrets
                    .get("ZANZARAH_PROJECT_SENDER")
                    .ok_or(ZZApiError::Empty)?,
                host: secrets
                    .get("ZANZARAH_PROJECT_SMTP_HOST")
                    .ok_or(ZZApiError::Empty)?,
                email: secrets
                    .get("ZANZARAH_PROJECT_APP_EMAIL")
                    .ok_or(ZZApiError::Empty)?,
                password: secrets
                    .get("ZANZARAH_PROJECT_APP_PASSWORD")
                    .ok_or(ZZApiError::Empty)?,
            },
        })
    }

    pub async fn get_user_by_email(
        &self,
        db: &DatabaseConnection,
        email: String,
    ) -> Result<Option<user::Model>, ZZApiError> {
        Ok(user::Entity::find()
            .filter(user::Column::Email.eq(email))
            .one(db)
            .await?)
    }

    pub async fn register_user(
        &self,
        db: &DatabaseConnection,
        email: String,
        password: String,
    ) -> Result<(), ZZApiError> {
        let current_time = chrono::Local::now();
        let time_delta = TimeDelta::minutes(5);
        let expiration_time = current_time.checked_add_signed(time_delta).unwrap();
        let totp = TOTP::new(
            totp_rs::Algorithm::SHA1,
            8,
            1,
            30,
            password.as_bytes().to_vec(),
        )
        .unwrap();
        let code = totp.generate(current_time.timestamp_millis() as u64);
        let model_to_insert = user::ActiveModel {
            name: Set(String::new()),
            email: Set(email.clone()),
            password: Set(password),
            permissions: Set(Permissions {
                types: vec![PermissionType::UnconfirmedUser],
            }),
            confirmation_state: Set(ConfirmationState::NotConfirmed(ConfirmationCodeInfo {
                value: code.clone(),
                expriration_time: expiration_time,
            })),
            ..Default::default()
        };
        model_to_insert.insert(db).await?;
        self.send_confirmation_email(email, code).await?;
        Ok(())
    }

    async fn send_confirmation_email(&self, email: String, code: String) -> Result<(), ZZApiError> {
        let message = MessageBuilder::new()
            .from((
                self.email_config.sender.as_str(),
                self.email_config.email.as_str(),
            ))
            .to(vec![("New zanzarah-project user", email.as_str())])
            .subject("HI!")
            .html_body(format!("<h1>Your confirmation code is {}</h1>", code))
            .text_body("Hello from zz-api");

        SmtpClientBuilder::new(self.email_config.host.clone(), 587)
            .implicit_tls(false)
            .credentials((
                self.email_config.email.clone(),
                self.email_config.password.clone(),
            ))
            .connect()
            .await
            .unwrap()
            .send(message)
            .await
            .unwrap();
        Ok(())
    }

    pub async fn resend_code(
        &self,
        db: &DatabaseConnection,
        email: String,
    ) -> Result<(), ZZApiError> {
        Ok(())
    }

    pub async fn confirm_email(
        &self,
        db: &DatabaseConnection,
        email: String,
        code: String,
    ) -> Result<(), ZZApiError> {
        if let Some(existing_user) = user::Entity::find()
            .filter(user::Column::Email.eq(email))
            .one(db)
            .await?
        {
            match existing_user.confirmation_state {
                ConfirmationState::NotConfirmed(ref code_info) => {
                    let current_time = chrono::Local::now();
                    if current_time > code_info.expriration_time {
                        Err(ZZApiError::Custom(
                            "Time to confirm code expired".to_string(),
                        ))
                    } else if code_info.value == code {
                        let mut model_to_update = existing_user.into_active_model();
                        model_to_update.confirmation_state =
                            Set(ConfirmationState::Confirmed(ActiveConfirmationInfo {
                                activated_at: current_time,
                            }));
                        model_to_update.permissions = Set(Permissions {
                            types: vec![PermissionType::ConfirmedUser],
                        });
                        model_to_update.update(db).await?;
                        Ok(())
                    } else {
                        Err(ZZApiError::Custom("Invalid confirmation code".to_string()))
                    }
                }
                _ => Err(ZZApiError::Custom(
                    "It is not possible to confirm already confirmed user".to_string(),
                )),
            }
        } else {
            Err(ZZApiError::Custom(
                "There's no user to confirm email in database".to_string(),
            ))
        }
    }
}
