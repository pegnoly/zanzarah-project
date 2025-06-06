import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"

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
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            setActiveCollectionMutation,
            {collectionId: data.collectionId}
        );
        return result;
    })