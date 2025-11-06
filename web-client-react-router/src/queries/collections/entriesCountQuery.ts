import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"

type EntriesCountQueryVariables = {
    collectionId: string
}

type EntriesCountQueryResult = {
    entriesCount: number
}

const getEntriesCountQuery = gql`
    query getEntriesCount($collectionId: ID!) {
        entriesCount(collectionId: $collectionId)
    }
`

export const getEntriesCount = async(data: EntriesCountQueryVariables) => {
    const result = await request<EntriesCountQueryResult | null, EntriesCountQueryVariables>(
        API_ENDPOINT,
        getEntriesCountQuery,
        {collectionId: data.collectionId}
    );
    return result?.entriesCount;
};