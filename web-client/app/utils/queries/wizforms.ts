import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { graphql } from "app/graphql";
import { WizformElementType } from "app/graphql/graphql";
import request from "graphql-request";

const query = `
    query wizformsQuery($bookId: ID!, $enabled: Boolean, $elementFilter: WizformElementType, $nameFilter: String) {
        wizforms(bookId: $bookId, enabled: $enabled, elementFilter: $elementFilter, nameFilter: $nameFilter) {
            name,
            icon64
        }
    }    
`

type WizformModel = {
    name: string,
    icon64
}

type WizformsModel = {
    wizforms: WizformModel[]
}

export type WizformsQueryVariables = {
    bookId: string,
    enabled?: boolean,
    elementFilter?: WizformElementType,
    nameFilter?: string
}

const fetchWizforms = createServerFn({method: 'POST'})
    .validator((d: WizformsQueryVariables) => d)
    .handler(
        async ({data}) => {
            const wizforms = await request<WizformsModel | undefined, WizformsQueryVariables>(
                'https://zz-webapi-cv7m.shuttle.app/', 
                query,
                data
            );
            return wizforms;
        })

export const fetchWizformsOptions = (variables: WizformsQueryVariables) => queryOptions({
    queryKey: ['wizforms'],
    queryFn: () => fetchWizforms({data: variables})
})