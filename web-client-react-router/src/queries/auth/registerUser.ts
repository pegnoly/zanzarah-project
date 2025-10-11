import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"

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
type RegisterUserMutationVariables = {
  email: string,
  password: string
}

type RegisterUserMutationResponse = {
  tryRegisterUser: RegistrationResult
}

export const registerUser = async(data: RegisterUserMutationVariables) => {
    const result = await request<RegisterUserMutationResponse | null, RegisterUserMutationVariables>(
      API_ENDPOINT,
      registerUserMutation,
      {email: data.email, password: data.password}
    )
    return result?.tryRegisterUser!;
}
