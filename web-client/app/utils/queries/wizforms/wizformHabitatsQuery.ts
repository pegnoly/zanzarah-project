import request, { gql } from "graphql-request"
import { WizformHabitatModel } from "./types"
import { createServerFn } from "@tanstack/react-start"
import { queryOptions } from "@tanstack/react-query"

type WizformHabitatsQueryResult = {
    wizformHabitats: WizformHabitatModel []
}

type WizformHabitatsQueryVariables = {
    wizformId: string
}

const wizformHabitatsQuery = gql`
    query wizformHabitatsQuery($wizformId: ID!) {
        wizformHabitats(wizformId: $wizformId) {
            sectionName,
            locationName,
            comment
        }
    }
`

const fetchWizformHabitats = createServerFn({method: 'GET'})
    .validator((data: WizformHabitatsQueryVariables) => data)
    .handler(
        async ({data}) => {
            const result = await request<WizformHabitatsQueryResult | undefined, WizformHabitatsQueryVariables>(
                'https://zanzarah-project-api-lyaq.shuttle.app/', 
                wizformHabitatsQuery,
                data
            );
            // console.log("Got result: ", result);
            return result?.wizformHabitats;
        });

export const fetchWizformHabitatsOptions = (variables: WizformHabitatsQueryVariables) => queryOptions({
    queryKey: ['wizform_habitats', variables.wizformId],
    queryFn: () => fetchWizformHabitats({data: variables}),
});
