import request, { gql } from "graphql-request"
import { RegistrationState, UserPermissionType } from "./utils"
import { createServerFn } from "@tanstack/react-start"

type SignInResult = {
  emailHash: string,
  newToken: string,
  passwordHash: string,
  permission: UserPermissionType,
  registrationState: RegistrationState
}

const signInQuery = gql`
    signInQuery($email: String!, $password: String!) {
        signIn(email: $email, password: $password) {
            emailHash,
            newToken,
            passwordHash,
            permission,
            registrationState
        }
    }
`

type SignInQueryVariables = {
    email: string,
    password: string
}

type SignInQueryResult = {
    signIn: SignInQueryResult
}

const signIn = createServerFn({method: 'GET'})
    .validator((data: SignInQueryVariables) => data)
    .handler(async({data}) => {
        const result = await request<SignInQueryResult | null, SignInQueryVariables>(
            'https://zanzarah-project-api-lyaq.shuttle.app/',
            signInQuery,
            {email: data.email, password: data.password}
        );
        return result;
    })