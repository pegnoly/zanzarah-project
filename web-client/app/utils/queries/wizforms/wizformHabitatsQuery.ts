import request, { gql } from "graphql-request"
import { WizformHabitatModel } from "./types"
import { createServerFn } from "@tanstack/react-start"
import { queryOptions } from "@tanstack/react-query"
import { config } from "@/utils/env"
import { API_ENDPOINT } from "../common"

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
                API_ENDPOINT, 
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
