import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"

export type LocationSection = {
    id: string,
    name: string,
    locationsCount: number
}

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

export const getLocationSections = createServerFn({method: 'GET'})
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


export type Location = {
    id: string,
    name: string,
    entriesCount: number
}

type LocationsQueryVariables = {
    sectionId: string
}

type LocationsQueryResult = {
    locations: Location []
}

const locationsQuery = gql`
    query locationsQuery($sectionId: ID!) {
        locations(sectionId: $sectionId) {
            id, 
            name,
            entriesCount
        }
    }
`

export const getLocations = createServerFn({method: 'GET'})
    .validator((data: LocationsQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<LocationsQueryResult | undefined, LocationsQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            locationsQuery,
            {sectionId: data.sectionId}
        );
        return result?.locations;
    });

export const fetchLocationsOptions = (data: LocationsQueryVariables) => queryOptions({
    queryKey: ['locations', data.sectionId],
    queryFn: () => getLocations({data})
})