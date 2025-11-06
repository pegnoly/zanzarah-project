import request, { gql } from "graphql-request"
import { useQuery } from "@tanstack/react-query"
import { API_ENDPOINT } from "../common"
import type { LocationWizformEntry } from "./types"

type LocationEntriesQueryVariables = {
    locationId: string
}

type LocationEntriesQueryResult = {
    locationEntries: LocationWizformEntry []
}

const document = gql`
    query locationEntriesQuery($locationId: ID!) {
        locationEntries(locationId: $locationId) {
            id,
            wizformName,
            wizformElement,
            wizformNumber,
            comment,
            icon
        }
    }
`

export function useLocationEntries(locationId: string) {
    return useQuery({
        queryKey: ['location_entries', locationId],
        queryFn: async() => {
            return request<LocationEntriesQueryResult | undefined, LocationEntriesQueryVariables>(
                API_ENDPOINT, 
                document,
                {locationId: locationId}
            )
        }
    })
}