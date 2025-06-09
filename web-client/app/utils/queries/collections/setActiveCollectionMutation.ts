import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { config } from "@/utils/env"

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

export const setActiveCollection = createServerFn({method: 'POST'})
    .validator((data: SetActiveCollectionMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<SetActiveCollectionMutationResult | null, SetActiveCollectionMutationVariables>(
            config.api_endpoint,
            setActiveCollectionMutation,
            {collectionId: data.collectionId}
        );
        return result;
    })