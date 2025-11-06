import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "./common"

const currentBookQuery = gql`
    query currentBookQuery($id: ID!) {
        currentBook(id: $id) {
            id,
            name,
            version,
            wizformsCount,
            activeWizformsCount
        }
    }
`

export type BookFullModel = {
    id: string,
    name: string,
    version: string,
    wizformsCount: number,
    activeWizformsCount: number
}

type BookQueryVariables = {
    id: string
} 

export type BookQueryResult = {
    currentBook: BookFullModel | null
}

export const fetchBook = async(data: BookQueryVariables) => {
    const book = await request<BookQueryResult | undefined, BookQueryVariables>(
        API_ENDPOINT,
        currentBookQuery,
        {id: data.id}
    );
    return book; 
};


const booksQuery = gql`
    query booksQuery($available: Boolean!) {
        books(available: $available) {
            id,
            name
        }
    }
`

export type BookSimpleModel = {
    id: string,
    name: string
}

type BooksQueryResult = {
    books: BookSimpleModel []
}

export type BooksQueryVariables = {
    available: boolean
}

export const fetchBooks = async(data: BooksQueryVariables) => {
    const books = await request<BooksQueryResult | undefined, BooksQueryVariables>(
        API_ENDPOINT,
        booksQuery,
        {available: data.available}
    );
    return books; 
};