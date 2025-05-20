import { graphql } from "graphql";
import request, { gql } from "graphql-request";
import { WizformElementType } from "../../graphql/graphql";
import { queryOptions } from "@tanstack/react-query";

const elementsQuery = gql`
    query elementsQuery($bookId: ID!) {
        elements(bookId: $bookId) {
            id,
            name,
            element,
            enabled
        }
    }
`

export type WizformElement = {
    id: number,
    name: string,
    element: WizformElementType,
    enabled: boolean
}

export type ElementsModel = {
    elements: WizformElement []
}

export type ElementsQueryVariables = {
    bookId: string
}

export const fetchElementsOptions = (variables: ElementsQueryVariables) => queryOptions({
    queryKey: ['elements'],
    queryFn: async() => request<ElementsModel | undefined, ElementsQueryVariables>({
        url: 'https://zanzarah-project-api-lyaq.shuttle.app/', 
        document: elementsQuery,
        variables: variables
    })
}) 