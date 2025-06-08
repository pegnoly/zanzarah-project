import request, { gql } from "graphql-request"
import { WizformFull, WizformHabitatModel } from "./types"
import { createServerFn } from "@tanstack/react-start"
import { queryOptions } from "@tanstack/react-query"

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

const fetchWizformComplete = createServerFn({method: 'GET'})
    .validator((data: WizformCompleteQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<WizformCompleteQueryResult | undefined, WizformCompleteQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            wizformCompleteQuery,
            data
        );
        return result;
    });

export const fetchWizformCompleteOptions = (variables: WizformCompleteQueryVariables) => queryOptions({
    queryKey: ['wizform_complete', variables.wizformId, variables.collectionId],
    queryFn: () => fetchWizformComplete({data: variables}),
});
