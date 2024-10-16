use std::path::PathBuf;

use zz_data::{book::base::BookDBModel, core::wizform::WizformDBModel};

use super::utils::{LocalAppManager, WizformMobileFrontendModel};

pub async fn create_local_db(app_manager: &LocalAppManager, path: PathBuf) {
    if path.exists() == false {
        std::fs::File::create(&path).unwrap();
    }

    let pool = sqlx::SqlitePool::connect(
        path.to_str().unwrap()
        )
        .await
        .unwrap();

    let mut local_pool = app_manager.local_pool.write().await;
    *local_pool = Some(pool);
}

pub async fn setup_local_db(app_manager: &LocalAppManager) {
    let sql = r#"
        CREATE TABLE IF NOT EXISTS books 
        (
            id TEXT PRIMARY KEY,
            name TEXT
        );
        CREATE TABLE IF NOT EXISTS wizforms 
        (
            id TEXT PRIMARY KEY,
            book_id TEXT,
            number INTEGER,
            name TEXT,
            description TEXT,
            element INTEGER,
            magics TEXT,
            hitpoints INTEGER,
            agility INTEGER,
            jump_ability INTEGER,
            precision INTEGER,
            evolution_form INTEGER,
            evolution_level INTEGER,
            exp_modifier INTEGER,
            enabled INTEGER,
            filters TEXT,
            spawn_points TEXT,
            icon TEXT
        );
        CREATE TABLE IF NOT EXISTS filters 
        (
            id TEXT PRIMARY KEY,
            book_id TEXT,
            name TEXT,
            filter_type INTEGER,
            enabled INTEGER
        );
        CREATE TABLE IF NOT EXISTS elements 
        (
            id TEXT PRIMARY KEY,
            book_id TEXT,
            name TEXT,
            element INTEGER,
            enabled INTEGER
        );
        CREATE TABLE IF NOT EXISTS spawn_points 
        (
            id TEXT PRIMARY KEY,
            book_id TEXT,
            name TEXT
        );
    "#;

    let pool = app_manager.local_pool.read().await;
    let pool_read_locked = pool.as_ref().unwrap();
    let res = sqlx::query(sql)
        .execute(pool_read_locked)
        .await
        .unwrap();
}

pub async fn try_load_books(app_manager: &LocalAppManager) -> Result<Vec<BookDBModel>, ()> {
    let client = app_manager.client.read().await;
    let books_response = client.get("https://zz-webapi.shuttleapp.rs/book/all")
        .send()
        .await;
    match books_response {
        Ok(books_success) => {
            let json: Result<Vec<BookDBModel>, reqwest::Error> = books_success.json().await;
            match json {
                Ok(books) => {
                    Ok(books)
                },
                Err(json_error) => {
                    println!("Error converting books from json: {}", json_error.to_string());
                    Err(())
                }
            }
        },
        Err(books_failure) => {
            println!("Error fetching existing books: {}", books_failure.to_string());
            Err(())
        }
    }
}

pub async fn try_load_wizforms(app_manager: &LocalAppManager, book_id: &String) -> Result<Vec<WizformMobileFrontendModel>, ()> {
    let client = app_manager.client.read().await;
    let pool_read_locked = app_manager.local_pool.read().await;
    let pool = pool_read_locked.as_ref().unwrap();
    let wizforms_response = client.get(format!("https://zz-webapi.shuttleapp.rs/wizforms/{}", &book_id))
        .send()
        .await;
    match wizforms_response {
        Ok(wizforms_success) => {
            let json: Result<Vec<WizformDBModel>, reqwest::Error> = wizforms_success.json().await;
            match json {
                Ok(wizforms) => {
                    let mut transaction = pool.begin().await.unwrap();
                    for wizform in wizforms.iter() {
                        sqlx::query(r#"
                            INSERT INTO wizforms 
                            (id, book_id, name, description, element, magics, icon, number,
                            evolution_form, evolution_level, exp_modifier, 
                            hitpoints, agility, jump_ability, precision, filters, spawn_points, enabled)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                        "#)
                        .bind(&wizform.id)
                        .bind(&wizform.book_id)
                        .bind(&String::from_utf8(wizform.name.clone()).unwrap())
                        .bind(&wizform.description)
                        .bind(wizform.element.clone() as i32)
                        .bind(&wizform.magics)
                        .bind(&wizform.icon64)
                        .bind(wizform.number)
                        .bind(wizform.evolution_form)
                        .bind(wizform.evolution_level)
                        .bind(wizform.exp_modifier)
                        .bind(wizform.hitpoints)
                        .bind(wizform.agility)
                        .bind(wizform.jump_ability)
                        .bind(wizform.precision)
                        .bind(serde_json::to_string(&wizform.filters).unwrap())
                        .bind(serde_json::to_string(&wizform.spawn_points).unwrap())
                        .bind(wizform.enabled)
                        .execute(&mut *transaction)
                        .await
                        .unwrap();
                    }
                    transaction.commit().await.unwrap();


                    let wizforms_converted: Vec<WizformMobileFrontendModel> = wizforms.into_iter().map(|w| {
                            WizformMobileFrontendModel::from(w)
                        }).collect();
                    Ok(wizforms_converted)
                },
                Err(e) => {
                    println!("Failed to parse enabled wizforms json: {}", e.to_string());
                    Err(())
                }
            }
        },
        Err(wizforms_failure) => {
            println!("Failed to fetch enabled wizforms: {}", wizforms_failure.to_string());
            Err(())
        }
    }
}