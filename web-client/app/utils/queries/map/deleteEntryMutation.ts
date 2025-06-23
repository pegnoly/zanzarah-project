import request, { gql } from "graphql-request"
import { SelectableWizform } from "./types"
import { createServerFn } from "@tanstack/react-start"
import { config } from "@/utils/env"
import { API_ENDPOINT } from "../common"

type DeleteLocationEntryMutationVariables = {
    id: string
}

type DeleteLocationEntryMutationResult = {
    removeLocationWizform: SelectableWizform | null
}

const deleteLocationEntryMutation = gql`
    mutation removeLocationWizformMutation($id: ID!) {
        removeLocationWizform(id: $id) {
            id,
            element,
            name,
            number
        }
    }
`

export const deleteLocationWizform = createServerFn({method: 'POST'})
    .validator((data: DeleteLocationEntryMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<DeleteLocationEntryMutationResult | undefined, DeleteLocationEntryMutationVariables>(
            API_ENDPOINT, 
            deleteLocationEntryMutation,
            {id: data.id}
        );
        return result?.removeLocationWizform;
    });