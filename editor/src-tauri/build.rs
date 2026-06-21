fn main() {
    cynic_codegen::register_schema("zanzarah-api")
        .from_sdl_file("D:/projects/zanzarah-project/editor/src-tauri/src/graphql/schemas/zz-webapi.graphql")
        .unwrap()
        .as_default()
        .unwrap();
    tauri_build::build()
}
