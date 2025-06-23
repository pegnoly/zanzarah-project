import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { config } from "@/utils/env"
import { API_ENDPOINT } from "../common"

type AddLocationEntryMutationVariables = {
    locationId: string,
    wizformId: string,
    comment: string | null
}

type AddLocationEntryMutationResult = {
    addLocationWizform: string
}

const addLocationWizformMutation = gql`
    mutation addLocationWizform($locationId: ID!, $wizformId: ID!, $comment: String) {
        addLocationWizform(locationId: $locationId, wizformId: $wizformId, comment: $comment)
    }
`

export const addLocationWizform = createServerFn({method: 'POST'})
    .validator((data: AddLocationEntryMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<AddLocationEntryMutationResult | undefined, AddLocationEntryMutationVariables>(
            API_ENDPOINT, 
            addLocationWizformMutation,
            {locationId: data.locationId, wizformId: data.wizformId, comment: data.comment}
        );
        return result?.addLocationWizform;
    });