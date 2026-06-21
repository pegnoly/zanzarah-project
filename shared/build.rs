use std::env;
use std::path::PathBuf;

fn main() {
    let out_dir = PathBuf::from(env::var("OUT_DIR").unwrap());
    let out_dir = out_dir.ancestors()
        .find(|path| path.ends_with("zanzarah-project"))
        .unwrap();
    tonic_prost_build::configure()
        .out_dir(out_dir.join("shared-gen/src"))
        .enum_attribute("WizformElementType", "#[derive(sea_orm::EnumIter, sea_orm::DeriveActiveEnum, serde::Serialize, serde::Deserialize)]")
        .enum_attribute("WizformElementType", "#[sea_orm(rs_type = \"i32\", db_type = \"Integer\")]")
        .enum_attribute("MagicElementType", "#[derive(sea_orm::EnumIter, sea_orm::DeriveActiveEnum, serde::Serialize, serde::Deserialize)]")
        .enum_attribute("MagicElementType", "#[sea_orm(rs_type = \"i32\", db_type = \"Integer\")]")
        .type_attribute("EvolutionItemModel", "#[derive(sea_orm::FromJsonQueryResult, serde::Serialize, serde::Deserialize)]")
        .type_attribute("EvolutionsListModel", "#[derive(Eq, sea_orm::FromJsonQueryResult, serde::Serialize, serde::Deserialize)]")
        .type_attribute("WizformListModel", "#[derive(sea_orm::FromQueryResult, serde::Serialize, serde::Deserialize)]")
        .type_attribute("WizformLocationModel", "#[derive(sea_orm::FromJsonQueryResult, serde::Serialize, serde::Deserialize)]")
        .type_attribute("WizformItemEvolutionModel", "#[derive(sea_orm::FromJsonQueryResult, serde::Serialize, serde::Deserialize)]")
        .type_attribute("MagicSlotModel", "#[derive(sea_orm::FromJsonQueryResult, serde::Serialize, serde::Deserialize)]")
        .type_attribute("MagicModel", "#[derive(sea_orm::FromJsonQueryResult, serde::Serialize, serde::Deserialize)]")
        .type_attribute("MagicsModel", "#[derive(sea_orm::FromJsonQueryResult, serde::Serialize, serde::Deserialize)]")
        .type_attribute("CompleteWizformModel", "#[derive(sea_orm::FromQueryResult, serde::Serialize, serde::Deserialize)]")
        .compile_protos(&[
            out_dir.join("proto/book/enums.proto"), 
            out_dir.join("proto/book/models.proto"),
            out_dir.join("proto/editor/service.proto"),
            out_dir.join("proto/book/service.proto"),
        ], &[out_dir.join("proto/")])
        .unwrap()
}