fn main() {
    cynic_codegen::register_schema("zanzarah-api")
        .from_sdl_file("C:/Users/pegn0ly/zanzarah-project/zz-parser/src-tauri/src/graphql/schemas/zz-webapi.graphql")
        .unwrap()
        .as_default()
        .unwrap();
    tauri_build::build()
}
