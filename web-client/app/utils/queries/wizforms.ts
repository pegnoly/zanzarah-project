import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { graphql } from "../../graphql";
import { WizformElementType } from "../../graphql/graphql"
import request from "graphql-request";

const query = `
    query wizformsQuery($bookId: ID!, $enabled: Boolean, $elementFilter: WizformElementType, $nameFilter: String) {
        wizforms(bookId: $bookId, enabled: $enabled, elementFilter: $elementFilter, nameFilter: $nameFilter) {
            name,
            icon64,
            id,
            number
        }
    }    
`

export type WizformSimpleModel = {
    id: string,
    name: string,
    icon64: string,
    number: number
}

export type WizformsModel = {
    wizforms: WizformSimpleModel[]
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
                'https://zanzarah-project-api-lyaq.shuttle.app/', 
                query,
                data
            );
            return wizforms;
        })

export const fetchWizformsOptions = (variables: WizformsQueryVariables) => queryOptions({
    queryKey: ['wizforms'],
    queryFn: () => fetchWizforms({data: variables})
});

export const fetchWizformsOptionsClient = (variables: WizformsQueryVariables) => queryOptions({
    queryKey: ['wizforms_client'],
    queryFn: async() => request<WizformsModel | undefined, WizformsQueryVariables>({
        url: 'https://zanzarah-project-api-lyaq.shuttle.app/', 
        document: query,
        variables: variables
    })
}) 