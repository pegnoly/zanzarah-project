import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import request, { gql } from "graphql-request";
import { requestTokenData } from "./processToken";
import { updateToken } from "./updateToken";

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
  userId: string | null,
  userState: RegistrationState,
  userPermission: UserPermissionType | null
}

export type UserClaims = {
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
      userId: null,
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
          authProps = {...authProps, userState: tokenData?.registrationState!, userPermission: tokenData?.permission!, userId: tokenData?.userId!};
        } else {
          const updatedTokenData = await updateToken({data: {email: userClaims.email, password: userClaims.password}});
          authProps = {...authProps, 
            userState: updatedTokenData?.registrationState!, 
            userPermission: updatedTokenData?.permission!, 
            userId: updatedTokenData?.userId!
          };
          await setTokenCookie({data: updatedTokenData?.newToken!})
        }
    } else {
      console.log("User claims not exist")
    }
    return authProps;
}

const tryGetExistingToken = createServerFn({method: 'GET'})
  .handler(async(): Promise<string | undefined> => {
    return getCookie('zanzarah-project-auth-token');
  });

export const setTokenCookie = createServerFn({method: 'POST'})
  .validator((value: string) => value)
  .handler(async({data}) => {
    setCookie('zanzarah-project-auth-token', data, {maxAge: 86400});
  })