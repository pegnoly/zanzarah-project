import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { config } from "@/utils/env"
import { API_ENDPOINT } from "../common"

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
            API_ENDPOINT,
            removeCollectionItemMutation,
            {id: data.id}
        );
        return result;
    })