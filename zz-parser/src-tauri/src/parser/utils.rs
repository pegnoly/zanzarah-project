pub fn to_le_hex_string(i: i32) -> String {
    let bytes = i.to_le_bytes();
    format!("{:X}", i32::from_be_bytes(bytes))
}