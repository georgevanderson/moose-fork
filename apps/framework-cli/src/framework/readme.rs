//! We generate a readme for your project when you initially create it.
//!
//! For now we'll just generate a static readme since we only support typescript projects for now.
//!
//! We'll add dynamic readme generation in the future to support more expressive readmes and additional languages in the future

pub static BASE_README_TEMPLATE: &str = r#"
# Welcome to your new project!

This is a new MooseJS project. You can find the documentation for MooseJS [here](https://docs.moosejs.com)

## Getting Started

To start your dev server, you can run the following commands:

```bash
npm install
npm run dev
```

## Project Structure

The project structured as follows:

```
project-root
│   README.md
│   package.json
│   .gitignore
│   .moose
└───app
    └───datamodels
    └───flows
    └───insights

```

## Data Models
You can find your data models in the `app/datamodels` directory. Data models define the structure of your data. You can find more information about data models [here](https://docs.moosejs.com)

## Flows (coming soon)
We're currently working on implementing flows. You'll be able to add them to your project soon.

## Insights (coming soon)
We're currently working on implementing insights. You'll be able to add them to your project soon.

"#;
