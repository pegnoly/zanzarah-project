import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { WizformElement } from "./elements"
import { WizformElementType } from "../../graphql/graphql"

export type LocationSection = {
    id: string,
    name: string,
    locationsCount: number
}

type LocationSectionsQueryVariables = {
    bookId: string
}

type LocationSectionsQueryResult = {
    sections: LocationSection []
}

const locationSectionsQuery = gql`
    query locationSectionQuery($bookId: ID!) {
        sections(bookId: $bookId) {
            id, 
            name,
            locationsCount
        }
    }
`

export const getLocationSections = createServerFn({method: 'GET'})
    .validator((data: LocationSectionsQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<LocationSectionsQueryResult | undefined, LocationSectionsQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            locationSectionsQuery,
            {bookId: data.bookId}
        );
        return result?.sections;
    });

export const fetchSectionsOptions = (data: LocationSectionsQueryVariables) => queryOptions({
    queryKey: ['sections', data.bookId],
    queryFn: () => getLocationSections({data})
})


export type Location = {
    id: string,
    name: string,
    entriesCount: number
}

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

export const getLocations = createServerFn({method: 'GET'})
    .validator((data: LocationsQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<LocationsQueryResult | undefined, LocationsQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            locationsQuery,
            {sectionId: data.sectionId}
        );
        return result?.locations;
    });

export const fetchLocationsOptions = (data: LocationsQueryVariables) => queryOptions({
    queryKey: ['locations', data.sectionId],
    queryFn: () => getLocations({data})
})

export type LocationWizformEntry = {
    id: string,
    wizformName: string,
    wizformElement: WizformElementType,
    wizformNumber: number
}

export type LocationFullModel = {
    wizforms: LocationWizformEntry []
}

type LocationEntriesQueryVariables = {
    locationId: string
}

export type LocationEntriesQueryResult = {
    locationEntries: LocationWizformEntry []
}

const locationEntriesQuery = gql`
    query locationEntriesQuery($locationId: ID!) {
        locationEntries(locationId: $locationId) {
            id,
            wizformName,
            wizformElement,
            wizformNumber
        }
    }
`

const fetchLocationEntries = createServerFn({method: 'GET'})
    .validator((data: LocationEntriesQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<LocationEntriesQueryResult | undefined, LocationEntriesQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            locationEntriesQuery,
            {locationId: data.locationId}
        );
        return result?.locationEntries;
    });

export const fetchLocationEntriesOptions = (data: LocationEntriesQueryVariables) => queryOptions({
    queryKey: ['location_entries', data.locationId],
    queryFn: () => fetchLocationEntries({data})
});

export type SelectableWizform = {
    id: string,
    name: string,
    element: WizformElementType,
    number: number
}

type SelectableWizformsQueryVariables = {
    bookId: string,
    locationId: string
}

export type SelectableWizformsQueryResult = {
    selectableWizforms: SelectableWizform []
}

const selectableWizformsQuery = gql`
    query selectableWizformsQuery($bookId: ID!, $locationId: ID!) {
        selectableWizforms(bookId: $bookId, locationId: $locationId) {
            id,
            name,
            element,
            number
        }
    }
`

const fetchSelectableWizforms = createServerFn({method: 'GET'})
    .validator((data: SelectableWizformsQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<SelectableWizformsQueryResult | undefined, SelectableWizformsQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            selectableWizformsQuery,
            {bookId: data.bookId, locationId: data.locationId}
        );
        return result?.selectableWizforms;
    });

export const fetchSelectableWizformsOptions = (data: SelectableWizformsQueryVariables) => queryOptions({
    queryKey: ['selectable_wizforms', data.bookId, data.locationId],
    queryFn: () => fetchSelectableWizforms({data})
});

type AddLocationEntryMutationVariables = {
    locationId: string,
    wizformId: string,
    comment: string | null
}

type AddLocationEntryMutationResult = {
    addLocationWizform: string
}

const addLocationWizformMutation = gql`
    mutation addLocationWizform($locationId: ID!, $wizformId: ID!, $comment: String) {
        addLocationWizform(locationId: $locationId, wizformId: $wizformId, comment: $comment)
    }
`

export const addLocationWizform = createServerFn({method: 'POST'})
    .validator((data: AddLocationEntryMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<AddLocationEntryMutationResult | undefined, AddLocationEntryMutationVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            addLocationWizformMutation,
            {locationId: data.locationId, wizformId: data.wizformId, comment: data.comment}
        );
        return result?.addLocationWizform;
    });

type DeleteLocationEntryMutationVariables = {
    id: string
}

type DeleteLocationEntryMutationResult = {
    removeLocationWizform: string
}

const deleteLocationEntryMutation = gql`
    mutation removeLocationWizformMutation($id: ID!) {
        removeLocationWizform(id: $id)
    }
`

export const deleteLocationWizform = createServerFn({method: 'POST'})
    .validator((data: DeleteLocationEntryMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<DeleteLocationEntryMutationResult | undefined, DeleteLocationEntryMutationVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            deleteLocationEntryMutation,
            {id: data.id}
        );
        return result?.removeLocationWizform;
    })