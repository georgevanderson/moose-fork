use std::{io::{Error, ErrorKind}, path::PathBuf, fs};

use crate::{cli::display::Message, framework::directories::{create_igloo_directory, get_igloo_directory, create_app_directories}, utilities::docker, infrastructure::PANDA_NETWORK};

use super::{Routine, RoutineFailure, RoutineSuccess, RunMode};


pub struct InitializeProject {
    run_mode: RunMode,
}
impl InitializeProject {
    pub fn new(run_mode: RunMode) -> Self {
        Self {run_mode}
    }
}
impl Routine for InitializeProject {
    fn run_silent(&self) -> Result<RoutineSuccess, RoutineFailure> {
        let run_mode = self.run_mode.clone();
        CreateIglooTempDirectoryTree::new(run_mode.clone()).run(run_mode.clone())?;
        let igloo_dir = get_igloo_directory().map_err(|err| {
            RoutineFailure::new(Message::new("Failed".to_string(), "to create .igloo directory. Check permissions or contact us`".to_string()), err)
        })?;
        create_app_directories().map_err(|err| {
            RoutineFailure::new(Message::new("Failed".to_string(), "to create app directory. Check permissions or contact us`".to_string()), err)
        })?;
        CreateDockerNetwork::new(PANDA_NETWORK).run(run_mode.clone())?;
        CreateVolumes::new(igloo_dir, run_mode.clone()).run(run_mode.clone())?;

        Ok(RoutineSuccess::success(Message::new("Created".to_string(), "Igloo directory with Red Panda and Clickhouse mount volumes".to_string())))
    }
}


pub struct CreateVolumes {
    igloo_dir: PathBuf,
    run_mode: RunMode,
}

impl CreateVolumes {
    fn new(igloo_dir: PathBuf, run_mode: RunMode) -> Self {
        Self { igloo_dir, run_mode }
    }
}

impl Routine for CreateVolumes {
    fn run_silent(&self) -> Result<RoutineSuccess, RoutineFailure> {
        let igloo_dir = self.igloo_dir.clone();
        let run_mode = self.run_mode.clone();
        CreateRedPandaMountVolume::new(igloo_dir.clone()).run(run_mode.clone())?;
        CreateClickhouseMountVolume::new(igloo_dir.clone()).run(run_mode.clone())?;

        Ok(RoutineSuccess::success(Message::new("Created".to_string(), "Red Panda and Clickhouse mount volumes".to_string())))
    }
}


pub struct ValidateMountVolumes {
    igloo_dir: PathBuf,
}
impl ValidateMountVolumes {
    pub fn new(igloo_dir: PathBuf) -> Self {
        Self { igloo_dir }
    }
}
impl Routine for ValidateMountVolumes {
    fn run_silent(&self) -> Result<RoutineSuccess, RoutineFailure> {
        let panda_house = self.igloo_dir.join(".panda_house").exists();
        let clickhouse = self.igloo_dir.join(".clickhouse").exists();

        if panda_house && clickhouse {
            Ok(RoutineSuccess::success(Message::new("Valid".to_string(), "Red Panda and Clickhouse mount volumes exist.".to_string())))
        } else {
            let message = format!("redpanda: {panda_house}, clickhouse: {clickhouse}");
            Err(RoutineFailure::new(Message::new("Mount volume status".to_string(), message.clone()), Error::new(ErrorKind::NotFound, message)))
        }
    }
}


pub struct CreateIglooTempDirectoryTree {
    run_mode: RunMode,
}
impl CreateIglooTempDirectoryTree {
    pub fn new(run_mode: RunMode) -> Self {
        Self { run_mode }
    }
}
impl Routine for CreateIglooTempDirectoryTree {
    fn run_silent(&self) -> Result<RoutineSuccess, RoutineFailure> {
        let igloo_dir = create_igloo_directory().map_err(|err| {
            RoutineFailure::new(Message::new("Failed".to_string(), "to create .igloo directory. Check permissions or contact us`".to_string()), err)
        })?;
        let run_mode = self.run_mode.clone();

        CreateTempDataVolumes::new(run_mode.clone()).run(run_mode.clone())?;
        ValidateMountVolumes::new(igloo_dir).run(run_mode.clone())?;

        Ok(RoutineSuccess::success(Message::new("Created".to_string(), "Igloo directory with Red Panda and Clickhouse mount volumes".to_string())))
    }
}


pub struct CreateTempDataVolumes{
    run_mode: RunMode,
}

impl CreateTempDataVolumes {
    fn new(run_mode: RunMode) -> Self {
        Self { run_mode }
    }
}
impl Routine for CreateTempDataVolumes {
    fn run_silent(&self) -> Result<RoutineSuccess, RoutineFailure> {
        if let Ok(igloo_dir) = get_igloo_directory() {
            let run_mode = self.run_mode.clone();
            CreateVolumes::new(igloo_dir, run_mode.clone()).run(run_mode.clone())?;
            Ok(RoutineSuccess::success(Message::new("Created".to_string(), "Red Panda and Clickhouse mount volumes".to_string())))
        } else {
            let igloo_dir = create_igloo_directory().map_err(|err| {
                RoutineFailure::new(Message::new("Failed".to_string(), "to create .igloo directory. Check permissions or contact us`".to_string()), err)
            })?;
            let run_mode = self.run_mode.clone();
            CreateVolumes::new(igloo_dir, run_mode.clone()).run(run_mode.clone())?;
            Ok(RoutineSuccess::success(Message::new("Created".to_string(), "Red Panda and Clickhouse mount volumes".to_string())))
        }
    }}


pub struct CreateRedPandaMountVolume {
    igloo_dir: PathBuf,
}

impl CreateRedPandaMountVolume {
    fn new(igloo_dir: PathBuf) -> Self {
        Self { igloo_dir }
    }
}

impl Routine for CreateRedPandaMountVolume {
    fn run_silent(&self) -> Result<RoutineSuccess, RoutineFailure> {
        let mount_dir = self.igloo_dir.join(".panda_house");
        match fs::create_dir_all(mount_dir.clone()) {
            Ok(_) => Ok(RoutineSuccess::success(Message::new("Created".to_string(), "Red Panda mount volume".to_string()))),
            Err(err) => {
                Err(RoutineFailure::new(Message::new("Failed".to_string(), format!("to create Red Panda mount volume in {}", mount_dir.display())), err))
            }
        }
    }
}

pub struct CreateClickhouseMountVolume {
    igloo_dir: PathBuf,
}

impl CreateClickhouseMountVolume {
    fn new(igloo_dir: PathBuf) -> Self {
        Self { igloo_dir }
    }
}

impl Routine for CreateClickhouseMountVolume {
    fn run_silent(&self) -> Result<RoutineSuccess, RoutineFailure> {
        let mount_dir = self.igloo_dir.join(".clickhouse");
        
        // fs::create_dir_all(&server_config_path)?;
        fs::create_dir_all(&mount_dir).map_err(|err| {
            RoutineFailure::new(Message::new("Failed".to_string(), format!("to create Clickhouse mount volume {}", mount_dir.display())), err)
        })?;
        fs::create_dir_all(&mount_dir.join("data")).map_err(|err| {
            RoutineFailure::new(Message::new("Failed".to_string(), format!("to create Clickhouse data mount volume in {}", mount_dir.display())), err)
        })?;
        fs::create_dir_all(&mount_dir.join("logs")).map_err(|err| {
            RoutineFailure::new(Message::new("Failed".to_string(), format!("to create Clickhouse logs mount volume in {}", mount_dir.display())), err)
        })?;
        // database::create_server_config_file(&server_config_path)?;
        // database::create_user_config_file(&user_config_path)?;
        // database::create_init_script(&scripts_path)?;

        Ok(RoutineSuccess::success(Message::new("Created".to_string(), "Clickhouse mount volumes".to_string())))
    }
        
}

pub struct CreateDockerNetwork {
    network_name: &'static str,
}

impl CreateDockerNetwork {
    fn new(network_name: &'static str) -> Self {
        Self { network_name }
    }
}

impl Routine for CreateDockerNetwork {
    fn run_silent(&self) -> Result<RoutineSuccess, RoutineFailure> {
        let output = docker::create_network(&self.network_name);

        match output {
            Ok(_) => {
                Ok(RoutineSuccess::success(Message::new("Created".to_string(), format!("docker network {}", &self.network_name))))
            },
            Err(err) => {
                Err(RoutineFailure::new(Message::new("Failed".to_string(), format!("to create docker network {}", &self.network_name)), err))
            },
        }
    }
}