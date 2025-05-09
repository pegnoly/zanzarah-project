use std::path::PathBuf;

use binary_reader::BinaryReader;

use crate::error::ZZParserError;
pub struct ZanzarahFileReader {
    reader: BinaryReader
}

impl ZanzarahFileReader {
    pub fn new(path: PathBuf) -> Result<Self, ZZParserError> {
        let mut file = std::fs::File::open(path)?;
        let mut reader = BinaryReader::from_file(&mut file);
        reader.set_endian(binary_reader::Endian::Little);
        Ok(ZanzarahFileReader { 
            reader
        })
    }

    pub fn read_bytes_with_skip(&mut self, count: usize) -> Result<&[u8], ZZParserError> {
        let bytes = self.reader.read_bytes(count)?;
        Ok(bytes)
    }

    pub fn read_smallint_with_skip(&mut self, skip: usize) -> Result<u16, ZZParserError> {
        let value = self.reader.read_u16()?;
        self.reader.read_bytes(skip)?;
        Ok(value)
    }

    pub fn read_int_with_skip(&mut self, skip: usize) -> Result<i32, ZZParserError> {
        let value = self.reader.read_i32()?;
        self.reader.read_bytes(skip)?;
        Ok(value)
    }

    pub fn read_string_with_skip(&mut self, skip: usize) -> Result<String, ZZParserError> {
        let value = self.reader.read_cstr()?;
        self.reader.read_bytes(skip)?;
        Ok(value)
    }
}