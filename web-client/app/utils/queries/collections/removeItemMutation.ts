import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { config } from "@/utils/env"

type RemoveCollectionItemMutationVariables = {
    id: string
}

type RemoveCollectionItemMutationResult = {
    removeCollectionItem: string
}

const removeCollectionItemMutation = gql`
    mutation removeCollectionItem($id: ID!) {
        removeCollectionItem(id: $id)
    }
`

export const removeCollectionItem = createServerFn({method: 'POST'})
    .validator((data: RemoveCollectionItemMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<RemoveCollectionItemMutationResult | null, RemoveCollectionItemMutationVariables>(
            config.api_endpoint,
            removeCollectionItemMutation,
            {id: data.id}
        );
        return result;
    })