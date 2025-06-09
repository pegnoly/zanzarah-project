import request, { gql } from "graphql-request"
import { RegistrationState, UserPermissionType } from "./utils"
import { createServerFn } from "@tanstack/react-start"
import { config } from "@/utils/env"

type SignInResult = {
  emailHash: string,
  newToken: string,
  passwordHash: string,
  permission: UserPermissionType,
  registrationState: RegistrationState,
  userId: string
}

const signInQuery = gql`
    query signInQuery($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
            emailHash,
            newToken,
            passwordHash,
            permission,
            registrationState,
            userId
        }
    }
`

type SignInQueryVariables = {
    email: string,
    password: string
}

type SignInQueryResult = {
    signIn: SignInResult
}

export const signIn = createServerFn({method: 'GET'})
    .validator((data: SignInQueryVariables) => data)
    .handler(async({data}): Promise<SignInQueryResult | null> => {
        const result = await request<SignInQueryResult | null, SignInQueryVariables>(
            config.api_endpoint,
            signInQuery,
            {email: data.email, password: data.password}
        );
        return result;
        // .then((result) => { return result; })
        // .catch((error) => { throw error; })
        // .finally
    })