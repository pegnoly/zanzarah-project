import { queryOptions, useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import request, { gql } from "graphql-request";

const collectionsQuery = gql`
    query collectionsQuery($userId: ID!, $bookId: ID!) {
        collections(userId: $userId, bookId: $bookId) {
            id,
            bookId,
            name,
            description,
            createdOnVersion,
            active
        }
    }
`

export const addCollectionItemMutation = gql`
    mutation addCollectionItem($collectionId: ID!, $wizformId: ID!) {
        addCollectionItem(collectionId: $collectionId, wizformId: $wizformId) {
            createdId
        }
    }
`

export type CollectionModel = {
    id: string,
    bookId: string,
    name: string,
    description: string,
    createdOnVersion: string,
    active: boolean
}

export type CollectionsQueryResult = {
    collections: CollectionModel []
}

export type CollectionsQueryVariables = {
    userId: number,
    bookId: string
}

export type AddCollectionItemMutationResult = {
    createdId: string
}

export type AddCollectionItemMutationVariables = {
    collectionId: string,
    wizformId: string
}

const fetchCollections = createServerFn({method: 'GET'})
    .validator((data: CollectionsQueryVariables) => data)
    .handler(async({data}) => {
        const collections = await request<CollectionsQueryResult | null, CollectionsQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            collectionsQuery,
            {bookId: data.bookId, userId: data.userId}
        );
        return collections;
    });

export const fetchCollectionsOptions = (data: CollectionsQueryVariables) => queryOptions({
    queryKey: ['collections', data.userId, data.bookId],
    queryFn: () => fetchCollections({data})
});

export const addCollectionItem = createServerFn({method: 'POST'})
    .validator((data: AddCollectionItemMutationVariables) => data)
    .handler(async({data}) => {
        const collectionItemId = await request<AddCollectionItemMutationResult | null, AddCollectionItemMutationVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            addCollectionItemMutation,
            {collectionId: data.collectionId, wizformId: data.wizformId}
        );
        return collectionItemId;
    });