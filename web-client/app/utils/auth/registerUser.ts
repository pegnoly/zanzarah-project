import { createServerFn } from "@tanstack/react-start"
import request, { gql } from "graphql-request"

type RegistrationResult = {
  userId: string,
  emailHash: string,
  passwordHash: string,
  token: string
}

const registerUserMutation = gql`
  mutation registerUser($email: String!, $password: String!) {
    tryRegisterUser(email: $email, password: $password) {
      userId,
      emailHash,
      passwordHash,
      token
    }
  }
`
export type RegisterUserMutationVariables = {
  email: string,
  password: string
}

export type RegisterUserMutationResponse = {
  tryRegisterUser: RegistrationResult
}

export const registerUser = createServerFn({method: 'POST'})
  .validator((data: RegisterUserMutationVariables) => data)
  .handler(async({data}): Promise<RegistrationResult | null> => {
    const result = await request<RegisterUserMutationResponse | null, RegisterUserMutationVariables>(
      'https://zanzarah-project-api-lyaq.shuttle.app/',
      registerUserMutation,
      {email: data.email, password: data.password}
    )
    return result?.tryRegisterUser!;
  })