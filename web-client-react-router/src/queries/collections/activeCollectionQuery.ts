import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"

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

export const fetchActiveCollection = async(data: ActiveCollectionQueryVariables) => {
    const result = await request<ActiveCollectionQueryResult | null, ActiveCollectionQueryVariables>(
        API_ENDPOINT,
        activeCollectionQuery,
        {bookId: data.bookId, userId: data.userId}
    );
    return result?.activeCollection;
};