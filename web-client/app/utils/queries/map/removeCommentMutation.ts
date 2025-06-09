import { config } from "@/utils/env"
import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"

type RemoveLocationEntryCommentMutationVariables = {
    id: string
}

type RemoveLocationEntryCommentMutationResult = {
    removeLocationWizformComment: string
}

const removeLocationEntryCommentMutation = gql`
    mutation removeLocationEntryCommentMutation($id: ID!) {
        removeLocationWizformComment(id: $id)
    }
`

export const removeLocationEntryComment = createServerFn({method: 'POST'})
    .validator((data: RemoveLocationEntryCommentMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<RemoveLocationEntryCommentMutationResult | undefined, RemoveLocationEntryCommentMutationVariables>(
            config.api_endpoint, 
            removeLocationEntryCommentMutation,
            {id: data.id}
        );
        return result?.removeLocationWizformComment;
    });