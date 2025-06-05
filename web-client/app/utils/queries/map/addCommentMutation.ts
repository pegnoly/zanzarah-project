import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"

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
            'https://zanzarah-project-api-lyaq.shuttle.app/', 
            addLocationEntryCommentMutation,
            {id: data.id, comment: data.comment}
        );
        return result?.addLocationWizformComment;
    });