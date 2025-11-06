import request, { gql } from "graphql-request"
import type { ItemEvolutionModel, WizformFull, WizformHabitatModel } from "./types"
import { useQuery } from "@tanstack/react-query"
import { API_ENDPOINT } from "../common"

export type WizformCompleteQueryResult = {
    wizform: WizformFull,
    wizformHabitats: WizformHabitatModel [],
    wizformEvolutionItems: ItemEvolutionModel []
}

type WizformCompleteQueryVariables = {
    wizformId: string,
    bookId: string,
    collectionId: string | null
}

const wizformCompleteQuery = gql`
    query wizformCompleteData($wizformId: ID!, $bookId: ID!, $collectionId: ID) {
        wizform(id: $wizformId, collectionId: $collectionId) {
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
            previousIcon,
            evolutionIcon,
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
        },
        wizformHabitats(wizformId: $wizformId) {
                sectionName,
                locationName,
                comment
        },
        wizformEvolutionItems(wizformId: $wizformId, bookId: $bookId) {
            itemName,
            itemIcon,
            wizformName,
            wizformIcon
        }
    }
`

export function useWizform(variables: WizformCompleteQueryVariables) {
    return useQuery({
        queryKey: ["wizform_focused", variables.wizformId, variables.bookId, variables.collectionId],
        queryFn: async() => {
            return request<WizformCompleteQueryResult | undefined, WizformCompleteQueryVariables>(
                API_ENDPOINT, 
                wizformCompleteQuery,
                variables
            );
        }
    })
}