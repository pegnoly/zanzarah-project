import { useQuery } from "@tanstack/react-query"
import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"
import type { Location } from "./types"

type LocationsQueryVariables = {
    sectionId: string
}

type LocationsQueryResult = {
    locations: Location []
}

const document = gql`
    query locationsQuery($sectionId: ID!) {
        locations(sectionId: $sectionId) {
            id, 
            name,
            entriesCount
        }
    }
`

export function useLocations(sectionId: string) {
    return useQuery({
        queryKey: ['locations', sectionId],
        queryFn: async() => {
            return request<LocationsQueryResult | undefined, LocationsQueryVariables>(
                API_ENDPOINT, 
                document,
                {sectionId: sectionId}
            )
        }
    })
}