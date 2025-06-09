import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"
import { config } from "@/utils/env"

type AddLocationEntryCommentMutationVariables = {
    id: string,
    comment: string
}

type AddLocationEntryCommentMutationResult = {
    addLocationWizformComment: string
}

const addLocationEntryCommentMutation = gql`
    mutation addLocationEntryCommentMutation($id: ID!, $comment: String!) {
        addLocationWizformComment(id: $id, comment: $comment)
    }
`

export const addLocationEntryComment = createServerFn({method: 'POST'})
    .validator((data: AddLocationEntryCommentMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<AddLocationEntryCommentMutationResult | undefined, AddLocationEntryCommentMutationVariables>(
            config.api_endpoint, 
            addLocationEntryCommentMutation,
            {id: data.id, comment: data.comment}
        );
        return result?.addLocationWizformComment;
    });