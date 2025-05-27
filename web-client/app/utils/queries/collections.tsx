import { queryOptions, useMutation } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import request, { gql } from "graphql-request";

const collectionsQuery = gql`
    query collectionsQuery($userId: ID!, $bookId: ID!) {
        collections(userId: $userId, bookId: $bookId) {
            id,
            bookId,
            name,
            createdOnVersion,
            active,
            entriesCount
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
    description: string | null,
    createdOnVersion: string,
    active: boolean,
    entriesCount: number
}

export type CollectionsQueryResult = {
    collections: CollectionModel []
}

export type CollectionsQueryVariables = {
    userId: string,
    bookId: string
}

type AddCollectionItemResult = {
    createdId: string
}

export type AddCollectionItemMutationResult = {
    addCollectionItem: AddCollectionItemResult
}

export type AddCollectionItemMutationVariables = {
    collectionId: string,
    wizformId: string
}

export const fetchCollections = createServerFn({method: 'GET'})
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
    // behavior:
    queryFn: () => fetchCollections({data}),
    staleTime: 0
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


type AddCollectionMutationVariables = {
    userId: string,
    bookId: string,
    name: string
}

type AddCollectionMutationResult = {
    createCollection: CollectionModel
}

const createCollectionMutation = gql`
    mutation createCollectionMutation($userId: ID!, $bookId: ID!, $name: String!) {
        createCollection(userId: $userId, bookId: $bookId, name: $name) {
            id,
            bookId,
            name,
            createdOnVersion,
            active
        }
    }
`

export const createCollection = createServerFn({method: 'POST'})
    .validator((data: AddCollectionMutationVariables) => data)
    .handler(async({data}) => {
        const collection = await request<AddCollectionMutationResult | null, AddCollectionMutationVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            createCollectionMutation,
            {bookId: data.bookId, userId: data.userId, name: data.name}
        );
        return collection?.createCollection
    })

type SetActiveCollectionMutationVariables = {
    collectionId: string
}

type SetActiveCollectionMutationResult = {
    setActiveCollection: string
}

const setActiveCollectionMutation = gql`
    mutation setActiveCollectionMutation($collectionId: ID!) {
        setActiveCollection(collectionId: $collectionId)
    }
`

export const setActiveCollection = createServerFn({method: 'POST'})
    .validator((data: SetActiveCollectionMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<SetActiveCollectionMutationResult | null, SetActiveCollectionMutationVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            setActiveCollectionMutation,
            {collectionId: data.collectionId}
        );
        return result;
    })

type GetActiveCollectionQueryVariables = {
    userId: string,
    bookId: string
}

type GetActiveCollectionQueryResult = {
    activeCollection: string | null
}

const activeCollectionQuery = gql`
    query activeCollectionQuery($bookId: ID!, $userId: ID!) {
        activeCollection(bookId: $bookId, userId: $userId)
    }
`

export const getActiveCollection = createServerFn({method: 'GET'})
    .validator((data: GetActiveCollectionQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<GetActiveCollectionQueryResult | null, GetActiveCollectionQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            activeCollectionQuery,
            {bookId: data.bookId, userId: data.userId}
        );
        return result?.activeCollection;
    })

type GetEntriesCountQueryVariables = {
    collectionId: string
}

type GetEntriesCountQueryResult = {
    entriesCount: number
}

const getEntriesCountQuery = gql`
    query getEntriesCount($collectionId: ID!) {
        entriesCount(collectionId: $collectionId)
    }
`

export const getEntriesCount = createServerFn({method: 'GET'})
    .validator((data: GetEntriesCountQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<GetEntriesCountQueryResult | null, GetEntriesCountQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            getEntriesCountQuery,
            {collectionId: data.collectionId}
        );
        return result?.entriesCount;
    })