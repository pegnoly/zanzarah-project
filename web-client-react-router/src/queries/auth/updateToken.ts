import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"
import type { RegistrationState, UserPermissionType } from "@/contexts/auth"

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

const document = gql`
    mutation updateTokenMutation($email: String!, $password: String!) {
        renewToken(email: $email, password: $password) {
            userId,
            newToken,
            permission,
            registrationState
        }
    }
`

export const updateToken = async(params: TokenUpdateMutationVariables) => {
    const result = await request<TokenUpdateMutationResult | null, TokenUpdateMutationVariables>(
        API_ENDPOINT,
        document,
        {email: params.email, password: params.password}
    );
    return result?.renewToken;
}