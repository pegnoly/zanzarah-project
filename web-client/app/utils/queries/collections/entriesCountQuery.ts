import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"

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

export const getEntriesCount = createServerFn({method: 'GET'})
    .validator((data: EntriesCountQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<EntriesCountQueryResult | null, EntriesCountQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            getEntriesCountQuery,
            {collectionId: data.collectionId}
        );
        return result?.entriesCount;
    })