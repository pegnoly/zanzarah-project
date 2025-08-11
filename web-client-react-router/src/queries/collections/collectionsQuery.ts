import request, { gql } from "graphql-request"
import { CollectionModel } from "./types"
import { createServerFn } from "@tanstack/react-start"
import { queryOptions } from "@tanstack/react-query"
import { config } from "@/utils/env"
import { API_ENDPOINT } from "../common"

type CollectionsQueryResult = {
    collections: CollectionModel []
}

type CollectionsQueryVariables = {
    userId: string,
    bookId: string
}

const collectionsQuery = gql`
    query collectionsQuery($userId: ID!, $bookId: ID!) {
        collections(userId: $userId, bookId: $bookId) {
            id,
            bookId,
            name,
            createdOnVersion,
            active,
            entriesCount
        }
    }
`

export const fetchCollections = createServerFn({method: 'GET'})
    .validator((data: CollectionsQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<CollectionsQueryResult | null, CollectionsQueryVariables>(
            API_ENDPOINT,
            collectionsQuery,
            {bookId: data.bookId, userId: data.userId}
        );
        return result?.collections;
    });

export const fetchCollectionsOptions = (data: CollectionsQueryVariables) => queryOptions({
    queryKey: ['collections', data.userId, data.bookId],
    queryFn: () => fetchCollections({data}),
    staleTime: 0
});