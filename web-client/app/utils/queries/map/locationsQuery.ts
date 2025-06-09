import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { Location } from "./types"
import { config } from "@/utils/env"

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

const getLocations = createServerFn({method: 'GET'})
    .validator((data: LocationsQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<LocationsQueryResult | undefined, LocationsQueryVariables>(
            config.api_endpoint, 
            locationsQuery,
            {sectionId: data.sectionId}
        );
        return result?.locations;
    });

export const fetchLocationsOptions = (data: LocationsQueryVariables) => queryOptions({
    queryKey: ['locations', data.sectionId],
    queryFn: () => getLocations({data})
})