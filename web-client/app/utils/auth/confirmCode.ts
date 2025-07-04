import request, { gql } from "graphql-request"
import { RegistrationState, UserPermissionType } from "./utils"
import { createServerFn } from "@tanstack/react-start"
import { getCookie } from "@tanstack/react-start/server"
import { config } from "@/utils/env"
import { API_ENDPOINT } from "../queries/common"

type EmailConfirmationResult = {
  newToken: string,
  registrationState: RegistrationState,
  permission: UserPermissionType
}

const confirmCodeMutation = gql`
  mutation confirmCodeMutation($email: String!, $code: String!) {
    confirmEmail(email: $email, code: $code) {
      registrationState,
      permission,
      newToken
    }
  }
`

export type ConfirmCodeMutationVariables = {
  code: string,
  email: string
}

export type ConfirmCodeMutationResult = {
  confirmEmail: EmailConfirmationResult
}

export const confirmCode = createServerFn({method: 'POST'})
  .validator((code: string) => code)
  .handler(async({data}) => {
    const emailCookie = getCookie('zanzarah-project-user-email')
    const result = await request<ConfirmCodeMutationResult | null, ConfirmCodeMutationVariables>(
      API_ENDPOINT,
      confirmCodeMutation,
      {email: emailCookie!, code: data}
    );
    return result;
  })