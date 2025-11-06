import type { UserPermissionType } from "@/contexts/auth"
import type { RegistrationState } from "@/graphql/graphql"
import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"

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

export const signIn = async(data: SignInQueryVariables) => {
    const result = await request<SignInQueryResult | null, SignInQueryVariables>(
        API_ENDPOINT,
        signInQuery,
        {email: data.email, password: data.password}
    );
    return result;
    // .then((result) => { return result; })
    // .catch((error) => { throw error; })
    // .finally
}