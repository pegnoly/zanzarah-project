import request, { gql } from "graphql-request";
import { WizformSimpleModel } from "./types";
import { WizformElementType } from "@/graphql/graphql";
import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { config } from "@/utils/env"
import { API_ENDPOINT } from "../common";

type WizformsQueryResult = {
    wizforms: WizformSimpleModel[]
}

type WizformsQueryVariables = {
    bookId: string,
    enabled?: boolean,
    elementFilter?: WizformElementType,
    nameFilter?: string,
    collection: string | null
}

const wizformsQuery = gql`
    query wizformsQuery($bookId: ID!, $enabled: Boolean, $elementFilter: WizformElementType, $nameFilter: String, $collection: String) {
        wizforms(bookId: $bookId, enabled: $enabled, elementFilter: $elementFilter, nameFilter: $nameFilter, collection: $collection) {
            name,
            icon64,
            id,
            number,
            inCollectionId
        }
    }    
`

const fetchWizforms = createServerFn({method: 'GET'})
    .validator((d: WizformsQueryVariables) => d)
    .handler(
        async ({data}) => {
            const result = await request<WizformsQueryResult | undefined, WizformsQueryVariables>(
                API_ENDPOINT, 
                wizformsQuery,
                data
            );
            return result?.wizforms;
        })

export const fetchWizformsOptions = (variables: WizformsQueryVariables) => queryOptions({
    queryKey: ['wizforms'],
    queryFn: () => fetchWizforms({data: variables}),
});

export const fetchWizformsOptionsClient = (variables: WizformsQueryVariables) => queryOptions({
    queryKey: ['wizforms_client'],
    queryFn: async() => request<WizformsQueryResult | undefined, WizformsQueryVariables>({
        url: API_ENDPOINT, 
        document: wizformsQuery,
        variables: variables
    })
}) 