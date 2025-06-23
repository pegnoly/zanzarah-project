import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { config } from "@/utils/env"
import { API_ENDPOINT } from "../common"

type CreatedCollectionItem = {
    createdId: string
}

export type AddCollectionItemMutationResult = {
    addCollectionItem: CreatedCollectionItem
}

export type AddCollectionItemMutationVariables = {
    collectionId: string,
    wizformId: string
}

const addCollectionItemMutation = gql`
    mutation addCollectionItem($collectionId: ID!, $wizformId: ID!) {
        addCollectionItem(collectionId: $collectionId, wizformId: $wizformId) {
            createdId
        }
    }
`

export const addCollectionItem = createServerFn({method: 'POST'})
    .validator((data: AddCollectionItemMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<AddCollectionItemMutationResult | null, AddCollectionItemMutationVariables>(
            API_ENDPOINT,
            addCollectionItemMutation,
            {collectionId: data.collectionId, wizformId: data.wizformId}
        );
        return result?.addCollectionItem;
    });