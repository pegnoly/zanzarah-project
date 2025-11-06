import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"

type CreatedCollectionItem = {
    createdId: string
}

type AddCollectionItemMutationResult = {
    addCollectionItem: CreatedCollectionItem
}

type AddCollectionItemMutationVariables = {
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

export const addCollectionItem = async(data: AddCollectionItemMutationVariables) => {
    const result = await request<AddCollectionItemMutationResult | null, AddCollectionItemMutationVariables>(
        API_ENDPOINT,
        addCollectionItemMutation,
        {collectionId: data.collectionId, wizformId: data.wizformId}
    );
    return result?.addCollectionItem;
};