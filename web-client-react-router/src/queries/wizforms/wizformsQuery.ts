import request, { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT } from "../common";
import type { WizformSimpleModel } from "./types";
import type { WizformElementType } from "../../graphql/graphql";

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

const document = gql`
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

export function useWizforms(variables: WizformsQueryVariables) {
    return useQuery({
        queryKey: ['wizforms', variables.bookId, variables.collection, variables.nameFilter, variables.elementFilter],
        queryFn: async() => request<WizformsQueryResult | undefined, WizformsQueryVariables>({
            url: API_ENDPOINT, 
            document: document,
            variables: variables
        })
    })
}