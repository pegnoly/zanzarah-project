import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"
import type { CollectionModel } from "./types"

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

export const fetchCollections = async(data: CollectionsQueryVariables) => {
    const result = await request<CollectionsQueryResult | null, CollectionsQueryVariables>(
        API_ENDPOINT,
        collectionsQuery,
        {bookId: data.bookId, userId: data.userId}
    );
    return result?.collections;
};