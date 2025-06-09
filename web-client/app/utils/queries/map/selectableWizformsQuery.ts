import request, { gql } from "graphql-request"
import { SelectableWizform } from "./types"
import { createServerFn } from "@tanstack/react-start"
import { queryOptions } from "@tanstack/react-query"
import { config } from "@/utils/env"

type SelectableWizformsQueryVariables = {
    bookId: string,
    locationId: string
}

type SelectableWizformsQueryResult = {
    selectableWizforms: SelectableWizform []
}

const selectableWizformsQuery = gql`
    query selectableWizformsQuery($bookId: ID!, $locationId: ID!) {
        selectableWizforms(bookId: $bookId, locationId: $locationId) {
            id,
            name,
            element,
            number
        }
    }
`

const fetchSelectableWizforms = createServerFn({method: 'GET'})
    .validator((data: SelectableWizformsQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<SelectableWizformsQueryResult | undefined, SelectableWizformsQueryVariables>(
            config.api_endpoint, 
            selectableWizformsQuery,
            {bookId: data.bookId, locationId: data.locationId}
        );
        return result?.selectableWizforms;
    });

export const fetchSelectableWizformsOptions = (data: SelectableWizformsQueryVariables) => queryOptions({
    queryKey: ['selectable_wizforms', data.bookId, data.locationId],
    queryFn: () => fetchSelectableWizforms({data})
});