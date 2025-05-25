import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import request, { gql } from "graphql-request";

export enum RegistrationState {
    Unregistered = "UNREGISTERED",
    Unchanged = "UNCHANGED",
    Unconfirmed = "UNCONFIRMED",
    Confirmed = "CONFIRMED"
}

export enum UserPermissionType {
    UnregisteredUser = "UNREGISTERED_USER",
    User = "USER",
    Editor = "EDITOR",
    Admin = "ADMIN"
}

export type AuthProps = {
    userState: RegistrationState,
    userPermission: UserPermissionType | null
}

type UserClaims = {
  email: string,
  password: string
}

const getUserClaims = createServerFn({method: 'GET'})
  .handler(async(): Promise<UserClaims | null> => {
    const emailCookie = getCookie('zanzarah-project-user-email');
    const passwordCookie = getCookie('zanzarah-project-user-password');
    const tokenCookie = getCookie('zanzarah-project-auth-token');
    console.log("User claims cookies: ", emailCookie, "; ", passwordCookie, "; ", tokenCookie);
    if (emailCookie == undefined || passwordCookie == undefined) {
        return null;
    } else {
        return {
            email: emailCookie!,
            password: passwordCookie!
        }
    }
  });

export const processAuth = async(): Promise<AuthProps> => {
    var authProps: AuthProps = {
        userState: RegistrationState.Unregistered,
        userPermission: UserPermissionType.UnregisteredUser
    }
    // first check for email and password
    const userClaims = await getUserClaims();
    if (userClaims) {
        // check for token
        const token = await tryGetExistingToken();
        // if token exists, get the values of user state and permissions from api
        if (token != undefined) {
          const tokenData = await requestTokenData({data: {token: token}});
          authProps = {...authProps, userState: tokenData?.registrationState!, userPermission: tokenData?.permission!};
        } else {
            //!TODO impl api request that takes email and password and returns new token with permissions
        }
        // authProps = {...authProps, userState: UserState.NotConfirmed}
    } else {
      console.log("User claims not exist")
    }
    return authProps;
}

const tryGetExistingToken = createServerFn({method: 'GET'})
  .handler(async(): Promise<string | undefined> => {
    return getCookie('zanzarah-project-auth-token');
  });

const setTokenCookie = createServerFn({method: 'POST'})
  .validator((value: string) => value)
  .handler(async({data}) => {
    setCookie('zanzarah-project-auth-token', data, {maxAge: 86400});
  })

const registerUserMutation = gql`
  mutation registerUser($email: String!, $password: String!) {
    tryRegisterUser(email: $email, password: $password) {
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

type RegistrationResult = {
  emailHash: string,
  passwordHash: string,
  token: string
}

const processTokenQuery = gql`
  query processTokenQuery($token: String!) {
    processToken(token: $token) {
      registrationState,
      permission
    }
  }
`

type ProcessTokenQueryVariables = {
  token: string
}


type AuthorizationResult = {
  registrationState: RegistrationState,
  permission: UserPermissionType
}

type ProcessTokenQueryResult = {
  processToken: AuthorizationResult
}

export const registerUser = createServerFn({method: 'POST'})
  .validator((data: RegisterUserMutationVariables) => data)
  .handler(async({data}): Promise<RegisterUserMutationResponse | null> => {
    const result = await request<RegisterUserMutationResponse | null, RegisterUserMutationVariables>(
      'https://zanzarah-project-api-lyaq.shuttle.app/',
      registerUserMutation,
      {email: data.email, password: data.password}
    )
    return result;
  })

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

const confirmCodeMutation = gql`
  mutation confirmCodeMutation($email: String!, $code: String!) {
    confirmEmail(email: $email, code: $code) {
      registrationState,
      permission
    }
  }
`

export type ConfirmCodeMutationVariables = {
  code: string,
  email: string
}

export type ConfirmCodeMutationResult = {
  confirmEmail: AuthorizationResult
}

export const confirmCode = createServerFn({method: 'POST'})
  .validator((code: string) => code)
  .handler(async({data}) => {
    const emailCookie = getCookie('zanzarah-project-user-email')
    const result = await request<ConfirmCodeMutationResult | null, ConfirmCodeMutationVariables>(
      'https://zanzarah-project-api-lyaq.shuttle.app/',
      confirmCodeMutation,
      {email: emailCookie!, code: data}
    );
    return result;
  })