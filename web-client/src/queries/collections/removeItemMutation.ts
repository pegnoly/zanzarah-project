import request, { gql } from "graphql-request"
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

export const removeCollectionItem = async(data: RemoveCollectionItemMutationVariables) => {
    const result = await request<RemoveCollectionItemMutationResult | null, RemoveCollectionItemMutationVariables>(
        API_ENDPOINT,
        removeCollectionItemMutation,
        {id: data.id}
    );
    return result;
};