import request, { gql } from "graphql-request";
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINT } from "./common";
import type { WizformElementType } from "@/graphql/graphql";

const document = gql`
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

type ElementsQueryVariables = {
    bookId: string
}

export function useElements(bookId: string) {
    return useQuery({
        queryKey: ['elements', bookId],
        queryFn: async() => {
            return request<ElementsQueryResult | null, ElementsQueryVariables>(
                API_ENDPOINT, 
                document,
                {bookId: bookId}
            );
        }
    })
}