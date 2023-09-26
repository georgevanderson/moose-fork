use std::io::{self, Write};
use rdkafka::{ClientConfig, producer::FutureProducer};

use crate::infrastructure::{stream::rpk, docker};

// TODO: We need to configure the application based on the current project directory structure to ensure that we catch changes made outside of development mode

// Creates a topic from a file name
pub fn create_topic_from_name(topic_name: String) {
    let output = docker::run_rpk_command(rpk::create_rpk_command_args(rpk::RPKCommand::Topic(rpk::TopicCommand::Create {topic_name})));

    match output {
        Ok(o) => {
            println!("Debugging docker container run");
            io::stdout().write_all(&o.stdout).unwrap();
        },
        Err(err) => {
            println!("{}",err)
        },
    }

}

// Deletes a topic from a file name
pub fn delete_topic(topic_name: String) {
    let valid_topic_name = topic_name.to_lowercase();
    let output = docker::run_rpk_command(rpk::create_rpk_command_args(rpk::RPKCommand::Topic(rpk::TopicCommand::Delete {topic_name: valid_topic_name})));

    match output {
        Ok(o) => {
            println!("Debugging docker container run");
            io::stdout().write_all(&o.stdout).unwrap();
        },
        Err(err) => {
            println!("{}",err)
        },
    }
}

#[derive(Copy, Clone)]
pub struct RedpandaConfig {
    pub broker: &'static str,
    pub message_timeout_ms: i32,
}

#[derive(Clone)]
pub struct ConfiguredProducer {
    pub producer: FutureProducer,
    pub config: RedpandaConfig,
}

pub fn create_producer(config: RedpandaConfig) -> ConfiguredProducer {
    let producer = ClientConfig::new()
        .set("bootstrap.servers", config.broker)
        .set("message.timeout.ms", config.message_timeout_ms.to_string())
        .create()
        .expect("Failed to create producer");

    ConfiguredProducer {
        producer,
        config,
    }
}