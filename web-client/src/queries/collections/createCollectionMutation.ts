import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"
import type { CollectionModel } from "./types"

type CreateCollectionMutationVariables = {
    userId: string,
    bookId: string,
    name: string
}

type CreateCollectionMutationResult = {
    createCollection: CollectionModel
}

const createCollectionMutation = gql`
    mutation createCollectionMutation($userId: ID!, $bookId: ID!, $name: String!) {
        createCollection(userId: $userId, bookId: $bookId, name: $name) {
            id,
            bookId,
            name,
            createdOnVersion,
            active
        }
    }
`

export const createCollection = async(data: CreateCollectionMutationVariables) => {
    const collection = await request<CreateCollectionMutationResult | null, CreateCollectionMutationVariables>(
        API_ENDPOINT,
        createCollectionMutation,
        {bookId: data.bookId, userId: data.userId, name: data.name}
    );
    return collection?.createCollection
};