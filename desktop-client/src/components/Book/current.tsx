import { Typography } from "antd";
import { Book } from "./types";

function CurrentBook(params: {book: Book | undefined}) {
    
    
    return <>{
        params.book == undefined ?
        <h1>No current book</h1> :
        <Typography.Text>{params.book.directory}</Typography.Text>
    }</>
}

export default CurrentBook;