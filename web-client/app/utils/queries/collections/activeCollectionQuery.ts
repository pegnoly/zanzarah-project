import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"

type ActiveCollectionQueryVariables = {
    userId: string,
    bookId: string
}

type ActiveCollectionQueryResult = {
    activeCollection: string | null
}

const activeCollectionQuery = gql`
    query activeCollectionQuery($bookId: ID!, $userId: ID!) {
        activeCollection(bookId: $bookId, userId: $userId)
    }
`

const fetchActiveCollection = createServerFn({method: 'GET'})
    .validator((data: ActiveCollectionQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<ActiveCollectionQueryResult | null, ActiveCollectionQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            activeCollectionQuery,
            {bookId: data.bookId, userId: data.userId}
        );
        return result?.activeCollection;
    });

export const fetchActiveCollectionOptions = (data: ActiveCollectionQueryVariables) => queryOptions({
    queryKey: ['active_collection', data.userId, data.bookId],
    queryFn: () => fetchActiveCollection({data})
});