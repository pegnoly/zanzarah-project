import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { config } from "@/utils/env"
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

export type BookQueryVariables = {
    id: string
} 

export type BookQueryResult = {
    currentBook: BookFullModel | null
}

const fetchBook = createServerFn({method: 'GET'})
    .validator((id: string) => id)
    .handler(async({data}) => {
        const book = await request<BookQueryResult | undefined, BookQueryVariables>(
            API_ENDPOINT,
            currentBookQuery,
            {id: data}
        );
        return book; 
    });

export const fetchBookOptions = (id: string) => queryOptions({
    queryKey: ['current_book', id],
    queryFn: () => fetchBook({data: id})
});

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

export type BooksQueryResult = {
    books: BookSimpleModel []
}

export type BooksQueryVariables = {
    available: boolean
}

const fetchBooks = createServerFn({method: 'GET'})
    .validator((available: boolean) => available)
    .handler(async({data}) => {
        const books = await request<BooksQueryResult | undefined, BooksQueryVariables>(
            API_ENDPOINT,
            booksQuery,
            {available: data}
        );
        return books; 
    });

export const fetchBooksOptions = (available: boolean) => queryOptions({
    queryKey: ['available_books'],
    queryFn: () => fetchBooks({data: available})
});