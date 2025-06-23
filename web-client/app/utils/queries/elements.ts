import request, { gql } from "graphql-request";
import { WizformElementType } from "../../graphql/graphql";
import { queryOptions } from "@tanstack/react-query";
import { config } from "@/utils/env"
import { createServerFn } from "@tanstack/react-start";
import { API_ENDPOINT } from "./common";

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

type ElementsQueryResult = {
    elements: WizformElement []
}

export type ElementsQueryVariables = {
    bookId: string
}

const fetchElements = createServerFn({method: 'GET'})
    .validator((data: ElementsQueryVariables) => data)
    .handler(async({data}) => {
        let result = await request<ElementsQueryResult | null, ElementsQueryVariables>(
            API_ENDPOINT, 
            elementsQuery,
            {bookId: data.bookId}
        );
        return result?.elements
    });

export const fetchElementsOptions = (variables: ElementsQueryVariables) => queryOptions({
    queryKey: ['elements'],
    queryFn: () => fetchElements({data: {bookId: variables.bookId}})
}) 