import request, { gql } from "graphql-request"
import { LocationSection } from "./types"
import { createServerFn } from "@tanstack/react-start"
import { queryOptions } from "@tanstack/react-query"

type LocationSectionsQueryVariables = {
    bookId: string
}

type LocationSectionsQueryResult = {
    sections: LocationSection []
}

const locationSectionsQuery = gql`
    query locationSectionQuery($bookId: ID!) {
        sections(bookId: $bookId) {
            id, 
            name,
            locationsCount
        }
    }
`

const getLocationSections = createServerFn({method: 'GET'})
    .validator((data: LocationSectionsQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<LocationSectionsQueryResult | undefined, LocationSectionsQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            locationSectionsQuery,
            {bookId: data.bookId}
        );
        return result?.sections;
    });

export const fetchSectionsOptions = (data: LocationSectionsQueryVariables) => queryOptions({
    queryKey: ['sections', data.bookId],
    queryFn: () => getLocationSections({data})
})