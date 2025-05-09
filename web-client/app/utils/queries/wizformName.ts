import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"

const wizformQueryDocument = gql`
    query WizformNameQuery($id: ID!) {
        wizform(id: $id) {
            name
        }
    }
`

type WizformName = {
    name: string
}

type WizformNameModel = {
    wizform: WizformName
}

type WizformNameQueryVariables = {
    id: string
}

const fetchWizformName = createServerFn({method: 'POST'})
    .validator((id: string) => id)
    .handler(
    async ({data}) => {
        console.info(`Fetching wizform ${data}`);
        const wizform = await request<WizformNameModel | undefined, WizformNameQueryVariables>(
            'https://zz-webapi-cv7m.shuttle.app/', 
            wizformQueryDocument,
            {id: data}
        );
        return wizform;
    }
)

export const fetchWizformNameOptions = (id: string) => queryOptions({
    queryKey: ['wizform', id],
    queryFn: () => fetchWizformName({data: id})
})