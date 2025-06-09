import request, { gql } from "graphql-request"
import { CollectionModel } from "./types"
import { createServerFn } from "@tanstack/react-start"
import { config } from "@/utils/env"

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

export const createCollection = createServerFn({method: 'POST'})
    .validator((data: CreateCollectionMutationVariables) => data)
    .handler(async({data}) => {
        const collection = await request<CreateCollectionMutationResult | null, CreateCollectionMutationVariables>(
            config.api_endpoint,
            createCollectionMutation,
            {bookId: data.bookId, userId: data.userId, name: data.name}
        );
        return collection?.createCollection
    })