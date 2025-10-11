import { createContext, use, useEffect, useState, type ReactNode } from "react";
import { updateToken } from "@/queries/auth/updateToken";
import { requestTokenData } from "@/queries/auth/processToken";
import type { SignInResult } from "@/graphql/graphql";
import Cookies from "js-cookie";

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
  userPermission: UserPermissionType | null,
}

export type UserClaims = {
  email: string,
  password: string
}

export interface AuthContextType {
  registrationState: RegistrationState | undefined,
  userPermission: UserPermissionType | undefined,
  userId: string | undefined,
  signIn: (data: SignInResult) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

function AuthProvider({children}: {children: ReactNode}) {
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [registrationState, setRegistrationState] = useState<RegistrationState | undefined>(undefined);
    const [permission, setPermission] = useState<UserPermissionType | undefined>(undefined);

    useEffect(() => {
      getAuthState();
    }, [])

    const getAuthState = async() => {
      const token = Cookies.get("zanzarah-project-auth-token");
      const email = Cookies.get("zanzarah-project-user-email");
      const password = Cookies.get("zanzarah-project-user-password");
      if (token == undefined) {
        if (email != undefined && password != undefined) {
          const updateTokenResult = await updateToken({email: email, password: password});
          if (updateTokenResult != undefined) {
            setRegistrationState(updateTokenResult.registrationState);
            setUserId(updateTokenResult.userId)
            setPermission(updateTokenResult.permission);
            Cookies.set("zanzarah_project-auth-token", updateTokenResult.newToken, {expires: 86400});
          }
        } else {
          setPermission(UserPermissionType.UnregisteredUser);
          setRegistrationState(RegistrationState.Unregistered);
        }
      } else {
        const authData = await requestTokenData({token: token});
        if (authData != undefined) {
          setRegistrationState(authData.registrationState);
          setPermission(authData.permission);
          setUserId(authData.userId);
        }
      }
    }

    const processSignIn = async(data: SignInResult) => {
        Cookies.set('zanzarah-project-user-email', data.emailHash, {expires: 10000000});
        Cookies.set('zanzarah-project-user-password', data.passwordHash, {expires: 10000000});
        Cookies.set('zanzarah-project-auth-token', data.newToken, {maxAge: 86400});

        setPermission(data.permission);
        setRegistrationState(data.registrationState);
        setUserId(data.userId);
    }

    return (
      <AuthContext.Provider value={{
        registrationState: registrationState, 
        userId: userId, 
        userPermission: permission,
        signIn: processSignIn 
      }}>
        {children}
      </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType | undefined => {
    const context = use(AuthContext);
    return context;
}

export default AuthProvider;