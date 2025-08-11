import request, { gql } from "graphql-request"
import type { WizformFull, WizformHabitatModel } from "./types"
import { useQuery } from "@tanstack/react-query"
import { API_ENDPOINT } from "../common"

export type WizformCompleteQueryResult = {
    wizform: WizformFull,
    wizformHabitats: WizformHabitatModel []
}

type WizformCompleteQueryVariables = {
    wizformId: string,
    collectionId: string | null
}

const wizformCompleteQuery = gql`
    query wizformCompleteData($wizformId: ID!, $collectionId: ID) {
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
        }
    }
`

export function useWizform(variables: WizformCompleteQueryVariables) {
    return useQuery({
        queryKey: ["wizform_focused", variables.wizformId, variables.collectionId],
        queryFn: async() => {
            return request<WizformCompleteQueryResult | undefined, WizformCompleteQueryVariables>(
                API_ENDPOINT, 
                wizformCompleteQuery,
                variables
            );
        }
    })
}