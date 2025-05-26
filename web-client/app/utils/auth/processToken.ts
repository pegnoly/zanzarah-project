import request, { gql } from "graphql-request"
import { RegistrationState, UserPermissionType } from "./utils"
import { createServerFn } from "@tanstack/react-start"

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

export const requestTokenData = createServerFn({method: 'GET'})
  .validator((data: ProcessTokenQueryVariables) => data)
  .handler(async({data}) => {
    const result = await request<ProcessTokenQueryResult | null, ProcessTokenQueryVariables>(
      'https://zanzarah-project-api-lyaq.shuttle.app/',
      processTokenQuery,
      {token: data.token}
    );
    console.log("Process token result: ", result);
    return result?.processToken;
  })