// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use log4rs::{append::{console::ConsoleAppender, file::FileAppender}, config::{Appender, Root}, encode::pattern::PatternEncoder, filter::threshold::ThresholdFilter, Config};

#[tokio::main]
async fn main() {
    let timestamp = chrono::prelude::Local::now().naive_local();
    let logs_dir = std::env::current_exe().unwrap().parent().unwrap().join("logs\\");
    if !logs_dir.exists() {
        std::fs::create_dir_all(&logs_dir).unwrap();
    }
    let logs_path = logs_dir.join(format!("{}.log", timestamp.to_string().replace(" ", "").replace(":", "_")));
    std::fs::File::create(&logs_path).unwrap();

    let stderr = ConsoleAppender::builder().target(log4rs::append::console::Target::Stderr).build();

    // Logging to log file.
    let logfile = FileAppender::builder()
        // Pattern: https://docs.rs/log4rs/*/log4rs/encode/pattern/index.html
        .encoder(Box::new(PatternEncoder::new("{l} - {m}\n")))
        .build(logs_path)
        .unwrap();

    // Log Trace level output to file where trace is the default level
    // and the programmatically specified level to stderr.
    let config = Config::builder()
        .appender(Appender::builder().build("logfile", Box::new(logfile)))
        .appender(
            Appender::builder()
                .filter(Box::new(ThresholdFilter::new(log::LevelFilter::Trace)))
                .build("stderr", Box::new(stderr)),
        )
        .build(
            Root::builder()
                .appender("logfile")
                .appender("stderr")
                .build(log::LevelFilter::Trace),
        )
        .unwrap();
    log4rs::init_config(config).unwrap();
    log::info!("Alive...");
    zz_parser_lib::run().await
}