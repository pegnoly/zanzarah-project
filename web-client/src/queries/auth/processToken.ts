import type { RegistrationState, UserPermissionType } from "@/contexts/auth"
import request, { gql } from "graphql-request"
import { API_ENDPOINT } from "../common"

type AuthorizationResult = {
  userId: string,
  registrationState: RegistrationState,
  permission: UserPermissionType
}

const processTokenQuery = gql`
  query processTokenQuery($token: String!) {
    processToken(token: $token) {
      userId,
      registrationState,
      permission
    }
  }
`

type ProcessTokenQueryVariables = {
  token: string
}

type ProcessTokenQueryResult = {
  processToken: AuthorizationResult
}

export const requestTokenData = async(params: ProcessTokenQueryVariables) => {
    const result = await request<ProcessTokenQueryResult | null, ProcessTokenQueryVariables>(
      API_ENDPOINT,
      processTokenQuery,
      {token: params.token}
    );
    return result?.processToken;
}