import request, { gql } from "graphql-request"
import { WizformFull } from "./types"
import { createServerFn } from "@tanstack/react-start"
import { queryOptions } from "@tanstack/react-query"
import { config } from "@/utils/env"
import { API_ENDPOINT } from "../common"

type WizformQueryResult = {
    wizform: WizformFull
}

type WizformQueryVariables = {
    id: string,
    collectionId: string | null
}

const wizformQuery = gql`
    query wizformQuery($id: ID!, $collectionId: ID) {
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


const fetchWizform = createServerFn({method: 'POST'})
    .validator((data: WizformQueryVariables) => data)
    .handler(
    async ({data}) => {
        //console.info(`Fetching wizform ${data}`);
        const wizform = await request<WizformQueryResult | undefined, WizformQueryVariables>(
            API_ENDPOINT, 
            wizformQuery,
            {id: data.id, collectionId: data.collectionId}
        );
        return wizform?.wizform;
    }
)

export const fetchWizformOptions = (data: WizformQueryVariables) => queryOptions({
    queryKey: ['wizform', data.id, data.collectionId],
    queryFn: () => fetchWizform({data})
})