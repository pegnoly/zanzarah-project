import { Button, ButtonGroup, Stack, Text, Tooltip } from "@mantine/core";
import { Book } from "./types";
import { invoke } from "@tauri-apps/api/core";

function CurrentBook(params: {book: Book | undefined}) {
    
    return <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>{
        params.book == undefined ?
        <h1>No current book</h1> :
        <Stack align="stretch" justify="center" gap={4}>
            <Text>{`Current book:  ${params.book.name}`}</Text>
            <div style={{display: 'flex', flexDirection: 'row'}}>
                <Text size="md" style={{fontFamily: 'cursive', fontWeight: 'bold'}}>{`Path:\t`}</Text>
                <Tooltip label={params.book.directory}>
                    <Text size="md" lineClamp={1}>{`${params.book.directory}`}</Text>
                </Tooltip>
            </div>
            <ButtonGroup>
                <Button onClick={() => invoke("start_parsing")}>Parse files</Button>
                <Button onClick={() => invoke("start_scripts_parsing")}>Parse scripts</Button>
            </ButtonGroup>
        </Stack>
    }</div>
}

export default CurrentBook;