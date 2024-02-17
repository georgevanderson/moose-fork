//! Template for generating data models
//!
//! We only generate a static base model for now. We'll add dynamic templates with tinytemplates in the future

pub static BASE_MODEL_TEMPLATE: &str = r#"
// This file was auto-generated by the framework. You can add data models or change the existing ones

model UserActivity {
    timestamp DateTime @id
    userId    String
    activity  String
}

"#;
