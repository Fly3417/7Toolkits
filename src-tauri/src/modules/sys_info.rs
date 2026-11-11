use serde::Serialize;

#[derive(Serialize)]
pub struct SysInfo {
    pub os: String,
    pub arch: String,
    pub hostname: String,
}

#[tauri::command]
pub fn get_sys_info() -> SysInfo {
    let os = std::env::consts::OS.to_string();
    let arch = std::env::consts::ARCH.to_string();
    let hostname = hostname::get()
        .unwrap_or_default()
        .into_string()
        .unwrap_or_else(|_| "unknown".to_string());

    SysInfo { os, arch, hostname }
}
