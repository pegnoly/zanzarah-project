import type { RegistrationState, UserPermissionType } from "@/contexts/auth"
import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"
import Cookies from "js-cookie"

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

type ConfirmCodeMutationVariables = {
  code: string,
  email: string
}

export type ConfirmCodeMutationResult = {
  confirmEmail: EmailConfirmationResult
}

export const confirmCode = async(data: ConfirmCodeMutationVariables) => {
    const emailCookie = Cookies.get('zanzarah-project-user-email')
    const result = await request<ConfirmCodeMutationResult | null, ConfirmCodeMutationVariables>(
        API_ENDPOINT,
        confirmCodeMutation,
        {email: emailCookie!, code: data.code}
    );
    return result;
}