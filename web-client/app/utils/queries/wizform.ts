import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { graphql } from "../../graphql"
import { WizformElementType } from "../../graphql/graphql"

const wizformQueryDocument = gql`
    query WizformNameQuery($id: ID!) {
        wizform(id: $id) {
            name,
            id,
            bookId,
            element,
            number,
            hitpoints,
            agility,
            jumpAbility,
            precision,
            evolutionName,
            previousFormName,
            evolutionLevel,
            expModifier,
            evolutionForm,
            previousForm
        }
    }
`

type WizformFull = {
    id: string,
    name: string,
    bookId: string,
    element: WizformElementType,
    number: number,
    hitpoints: number,
    agility: number,
    jumpAbility: number,
    precision: number,
    evolutionName: string,
    previousFormName: string,
    evolutionLevel: number,
    expModifier: number,
    evolutionForm: number,
    previousForm: number
}

type WizformName = {
    name: string
}

type WizformNameModel = {
    wizform: WizformName
}

type WizformFullModel = {
    wizform: WizformFull
}

type WizformNameQueryVariables = {
    id: string
}

const fetchWizform = createServerFn({method: 'POST'})
    .validator((id: string) => id)
    .handler(
    async ({data}) => {
        console.info(`Fetching wizform ${data}`);
        const wizform = await request<WizformFullModel | undefined, WizformNameQueryVariables>(
            'https://zz-webapi-cv7m.shuttle.app/', 
            wizformQueryDocument,
            {id: data}
        );
        return wizform;
    }
)

export const fetchWizformOptions = (id: string) => queryOptions({
    queryKey: ['wizform', id],
    queryFn: () => fetchWizform({data: id})
})