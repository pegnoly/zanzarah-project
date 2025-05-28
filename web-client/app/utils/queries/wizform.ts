import { queryOptions } from "@tanstack/react-query"
import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { WizformElementType } from "../../graphql/graphql"

const wizformQueryDocument = gql`
    query WizformNameQuery($id: ID!, $collectionId: ID) {
        wizform(id: $id, collectionId: $collectionId) {
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
            previousForm,
            inCollectionId,
            magics {
                types {
                    level,
                    firstActiveSlot {
                        firstElement,
                        secondElement,
                        thirdElement
                    },
                    secondActiveSlot {
                        firstElement,
                        secondElement,
                        thirdElement
                    },
                    firstPassiveSlot {
                        firstElement,
                        secondElement,
                        thirdElement
                    },
                    secondPassiveSlot {
                        firstElement,
                        secondElement,
                        thirdElement
                    }
                }
            }
        }
    }
`

export enum MagicElementType {
    Air = 'AIR',
    Chaos = 'CHAOS',
    Dark = 'DARK',
    Energy = 'ENERGY',
    Error = 'ERROR',
    Fire = 'FIRE',
    Ice = 'ICE',
    Joker = 'JOKER',
    Light = 'LIGHT',
    Metall = 'METALL',
    Nature = 'NATURE',
    None = 'NONE',
    Psi = 'PSI',
    Stone = 'STONE',
    Water = 'WATER'
}

export type MagicSlot = {
    firstElement: MagicElementType,
    secondElement: MagicElementType,
    thirdElement: MagicElementType
}

export type Magic = {
  firstActiveSlot: MagicSlot,
  firstPassiveSlot: MagicSlot,
  level: number,
  secondActiveSlot: MagicSlot,
  secondPassiveSlot: MagicSlot,
}

type Magics = {
    types: Magic[]
}


export type WizformFull = {
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
    previousForm: number,
    magics: Magics,
    inCollectionId: string | null
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
    id: string,
    collectionId: string | null
}

const fetchWizform = createServerFn({method: 'POST'})
    .validator((data: WizformNameQueryVariables) => data)
    .handler(
    async ({data}) => {
        //console.info(`Fetching wizform ${data}`);
        const wizform = await request<WizformFullModel | undefined, WizformNameQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            wizformQueryDocument,
            {id: data.id, collectionId: data.collectionId}
        );
        return wizform;
    }
)

export const fetchWizformOptions = (data: WizformNameQueryVariables) => queryOptions({
    queryKey: ['wizform', data.id, data.collectionId],
    queryFn: () => fetchWizform({data})
})