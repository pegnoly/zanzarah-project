import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"

type SetActiveCollectionMutationVariables = {
    collectionId: string
}

type SetActiveCollectionMutationResult = {
    setActiveCollection: string
}

const setActiveCollectionMutation = gql`
    mutation setActiveCollectionMutation($collectionId: ID!) {
        setActiveCollection(collectionId: $collectionId)
    }
`

export const setActiveCollection = async(data: SetActiveCollectionMutationVariables) => {
    const result = await request<SetActiveCollectionMutationResult | null, SetActiveCollectionMutationVariables>(
        API_ENDPOINT,
        setActiveCollectionMutation,
        {collectionId: data.collectionId}
    );
    return result;
};