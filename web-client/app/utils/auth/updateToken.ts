import request, { gql } from "graphql-request"
import { RegistrationState, UserPermissionType } from "./utils"
import { createServerFn } from "@tanstack/react-start"

type TokenUpdateResult = {
  userId: string,
  newToken: string,
  permission: UserPermissionType,
  registrationState: RegistrationState
}

type TokenUpdateMutationVariables = {
    email: string,
    password: string
}

type TokenUpdateMutationResult = {
    renewToken: TokenUpdateResult
}

const updateTokenMutation = gql`
    mutation updateTokenMutation($email: String!, $password: String!) {
        renewToken(email: $email, password: $password) {
            userId,
            newToken,
            permission,
            registrationState
        }
    }
`

export const updateToken = createServerFn({method: 'POST'})
    .validator((data: TokenUpdateMutationVariables) => data)
    .handler(async({data}) => {
        const result = await request<TokenUpdateMutationResult | null, TokenUpdateMutationVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            updateTokenMutation,
            {email: data.email, password: data.password}
        );
        return result?.renewToken;
    })