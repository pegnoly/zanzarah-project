import request, { gql } from "graphql-request"
import { LocationWizformEntry } from "./types"
import { createServerFn } from "@tanstack/react-start"
import { queryOptions } from "@tanstack/react-query"
import { config } from "@/utils/env"

type LocationEntriesQueryVariables = {
    locationId: string
}

type LocationEntriesQueryResult = {
    locationEntries: LocationWizformEntry []
}

const locationEntriesQuery = gql`
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

const fetchLocationEntries = createServerFn({method: 'GET'})
    .validator((data: LocationEntriesQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<LocationEntriesQueryResult | undefined, LocationEntriesQueryVariables>(
            config.api_endpoint, 
            locationEntriesQuery,
            {locationId: data.locationId}
        );
        return result?.locationEntries;
    });

export const fetchLocationEntriesOptions = (data: LocationEntriesQueryVariables) => queryOptions({
    queryKey: ['location_entries', data.locationId],
    queryFn: () => fetchLocationEntries({data})
});