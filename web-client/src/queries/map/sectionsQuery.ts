import request, { gql } from "graphql-request"
import { useQuery } from "@tanstack/react-query"
import { API_ENDPOINT } from "../common"
import type { LocationSection } from "./types"

type LocationSectionsQueryVariables = {
    bookId: string
}

type LocationSectionsQueryResult = {
    sections: LocationSection []
}

const document = gql`
    query locationSectionQuery($bookId: ID!) {
        sections(bookId: $bookId) {
            id, 
            name,
            locationsCount
        }
    }
`
export function useSections(bookId: string) {
    return useQuery({
        queryKey: ['sections', bookId],
        queryFn: async() => {
            return request<LocationSectionsQueryResult | undefined, LocationSectionsQueryVariables>(
                API_ENDPOINT, 
                document,
                {bookId: bookId}
            );
        },
    })
}