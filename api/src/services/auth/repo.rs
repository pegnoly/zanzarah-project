use argon2::{
    Argon2, PasswordHash, PasswordVerifier,
    password_hash::{PasswordHasher, SaltString, rand_core::OsRng},
};
use jsonwebtoken::{Algorithm, DecodingKey, EncodingKey, Header, Validation};
use mail_send::{SmtpClientBuilder, mail_builder::MessageBuilder};
use rand::seq::IteratorRandom;
use sea_orm::{
    ActiveModelTrait, ActiveValue::Set, ColumnTrait, DatabaseConnection, EntityTrait,
    IntoActiveModel, QueryFilter,
};
use shuttle_runtime::SecretStore;
use totp_rs::TOTP;
use uuid::Uuid;

use crate::{
    error::ZZApiError,
    services::book::models::wizform::{self, WizformNameModel},
};

use super::{
    models::user::{self, RegistrationState, UserPermissionType},
    utils::{
        AuthorizationResult, EmailConfirmationResult, RegistrationResult, SignInResult,
        TokenUpdateResult, UserClaims,
    },
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
    email_salt: String,
    encoding_key: EncodingKey,
    decoding_key: DecodingKey,
}

impl AuthRepository {
    pub fn new(secrets: &SecretStore) -> Result<Self, ZZApiError> {
        let jwt_validator = secrets.get("JWT_SECRET_VALIDATOR").unwrap();
        let email_salt = secrets.get("EMAIL_HASHER").unwrap();
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
            email_salt,
            encoding_key: EncodingKey::from_secret(jwt_validator.as_bytes()),
            decoding_key: DecodingKey::from_secret(jwt_validator.as_bytes()),
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
    ) -> Result<RegistrationResult, ZZApiError> {
        // generation of hashes
        let argon2 = Argon2::default();
        let salt = SaltString::generate(&mut OsRng);
        let email_hash = argon2
            .hash_password(email.as_bytes(), &SaltString::from_b64(&self.email_salt)?)?
            .to_string();

        if let Some(_existing_user) = user::Entity::find()
            .filter(user::Column::Email.eq(email_hash.clone()))
            .one(db)
            .await?
        {
            return Err(ZZApiError::EmailAlreadyExists);
        }

        let password_hash = argon2
            .hash_password(password.as_bytes(), &salt)?
            .to_string();
        // generation of confirmation code
        let totp = TOTP::new(
            totp_rs::Algorithm::SHA1,
            8,
            1,
            30,
            password.as_bytes().to_vec(),
        )?;
        let code = totp.generate(chrono::Local::now().timestamp_millis() as u64);
        // generate name
        let wizforms_names = wizform::Entity::find()
            .filter(wizform::Column::Enabled.eq(true))
            .into_partial_model::<WizformNameModel>()
            .all(db)
            .await?;
        let name = wizforms_names
            .iter()
            .choose(&mut rand::rng())
            .unwrap()
            .name
            .clone();
        let model_to_insert = user::ActiveModel {
            id: Set(Uuid::new_v4()),
            name: Set(name),
            email: Set(email_hash.to_string()),
            salt: Set(salt.to_string()),
            hashed_password: Set(password_hash.clone()),
            permission: Set(UserPermissionType::UnregisteredUser),
            registration_state: Set(RegistrationState::Unconfirmed),
            confirmation_code: Set(Some(code.clone())),
        };
        let model = model_to_insert.insert(db).await?;
        self.send_confirmation_email(email.clone(), code).await?;
        let base_user_claims = UserClaims {
            email: email_hash.clone(),
            password: password_hash.clone(),
            registration_state: RegistrationState::Unconfirmed,
            permission: UserPermissionType::UnregisteredUser,
            exp: chrono::Local::now().timestamp() + 86400,
        };
        let token =
            jsonwebtoken::encode(&Header::default(), &base_user_claims, &self.encoding_key)?;
        Ok(RegistrationResult {
            user_id: model.id.into(),
            email_hash,
            password_hash,
            token,
        })
    }

    async fn send_confirmation_email(&self, email: String, code: String) -> Result<(), ZZApiError> {
        let message = MessageBuilder::new()
            .from((
                self.email_config.sender.as_str(),
                self.email_config.email.as_str(),
            ))
            .to(vec![("New zanzarah-project user", email.as_str())])
            .subject("Подтверждение аккаунта для Zanzarah project")
            .html_body(format!("<h1>Ваш код подтверждения - {code}</h1>"))
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

    pub async fn get_user_data_from_token(
        &self,
        db: &DatabaseConnection,
        token: String,
    ) -> Result<AuthorizationResult, ZZApiError> {
        let validation_info = Validation::new(Algorithm::default());
        let user_data =
            jsonwebtoken::decode::<UserClaims>(&token, &self.decoding_key, &validation_info)?;
        tracing::info!("Got user data from token: {:#?}", &user_data);
        if let Some(existing_user) = user::Entity::find()
            .filter(user::Column::Email.eq(user_data.claims.email))
            .one(db)
            .await?
        {
            Ok(AuthorizationResult {
                user_id: existing_user.id.into(),
                registration_state: user_data.claims.registration_state,
                permission: user_data.claims.permission,
            })
        } else {
            Err(ZZApiError::Custom(
                "No user to match this token data".to_string(),
            ))
        }
    }

    pub async fn generate_new_token(
        &self,
        db: &DatabaseConnection,
        email_hash: String,
        password_hash: String,
    ) -> Result<TokenUpdateResult, ZZApiError> {
        if let Some(existing_user) = user::Entity::find()
            .filter(user::Column::Email.eq(email_hash.clone()))
            .one(db)
            .await?
        {
            let claims = UserClaims {
                email: email_hash,
                password: password_hash,
                registration_state: existing_user.registration_state,
                permission: existing_user.permission,
                exp: chrono::Local::now().timestamp() + 86400,
            };
            let token = jsonwebtoken::encode(&Header::default(), &claims, &self.encoding_key)?;
            Ok(TokenUpdateResult {
                user_id: existing_user.id.into(),
                new_token: token,
                registration_state: existing_user.registration_state,
                permission: existing_user.permission,
            })
        } else {
            Err(ZZApiError::SeaOrmError(sea_orm::DbErr::RecordNotFound(
                "Can't find user id database".to_string(),
            )))
        }
    }

    pub async fn sign_in(
        &self,
        db: &DatabaseConnection,
        email: String,
        password: String,
    ) -> Result<SignInResult, ZZApiError> {
        let argon2 = Argon2::default();
        let email_hash = argon2
            .hash_password(email.as_bytes(), &SaltString::from_b64(&self.email_salt)?)?
            .to_string();
        if let Some(existing_user) = user::Entity::find()
            .filter(user::Column::Email.eq(email_hash.clone()))
            .one(db)
            .await?
        {
            let password_hash = PasswordHash::new(&existing_user.hashed_password)?;
            if let Ok(()) = argon2.verify_password(password.as_bytes(), &password_hash) {
                let claims = UserClaims {
                    email: email_hash.clone(),
                    password: existing_user.hashed_password.clone(),
                    registration_state: existing_user.registration_state,
                    permission: existing_user.permission,
                    exp: chrono::Local::now().timestamp() + 86400,
                };
                let token = jsonwebtoken::encode(&Header::default(), &claims, &self.encoding_key)?;
                Ok(SignInResult {
                    email_hash,
                    new_token: token,
                    password_hash: existing_user.hashed_password,
                    registration_state: existing_user.registration_state,
                    permission: existing_user.permission,
                    user_id: existing_user.id.into(),
                })
            } else {
                Err(ZZApiError::IncorrectPassword)
            }
        } else {
            Err(ZZApiError::IncorrectEmail)
        }
    }

    pub async fn confirm_email(
        &self,
        db: &DatabaseConnection,
        email: String,
        code: String,
    ) -> Result<EmailConfirmationResult, ZZApiError> {
        if let Some(existing_user) = user::Entity::find()
            .filter(user::Column::Email.eq(email))
            .one(db)
            .await?
        {
            match existing_user.registration_state {
                RegistrationState::Unconfirmed => {
                    if let Some(ref confirmation_code) = existing_user.confirmation_code {
                        if *confirmation_code == code {
                            let mut model_to_update = existing_user.clone().into_active_model();
                            model_to_update.registration_state = Set(RegistrationState::Confirmed);
                            model_to_update.permission = Set(UserPermissionType::User);
                            model_to_update.confirmation_code = Set(None);
                            model_to_update.update(db).await?;
                            //
                            let updated_claims = UserClaims {
                                email: existing_user.email.clone(),
                                password: existing_user.hashed_password.clone(),
                                registration_state: RegistrationState::Confirmed,
                                permission: UserPermissionType::User,
                                exp: chrono::Local::now().timestamp() + 86400,
                            };
                            let token = jsonwebtoken::encode(
                                &Header::default(),
                                &updated_claims,
                                &self.encoding_key,
                            )?;
                            Ok(EmailConfirmationResult {
                                new_token: token,
                                permission: UserPermissionType::User,
                                registration_state: RegistrationState::Confirmed,
                            })
                        } else {
                            Err(ZZApiError::IncorrectCode)
                        }
                    } else {
                        Err(ZZApiError::CodeAlreadyUsed)
                    }
                }
                _ => Err(ZZApiError::UserAlreadyConfirmed),
            }
        } else {
            Err(ZZApiError::Custom(
                "There's no user to confirm email in database".to_string(),
            ))
        }
    }
}
