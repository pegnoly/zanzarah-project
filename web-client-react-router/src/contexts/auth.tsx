import { createContext, use, useEffect, useState, type ReactNode } from "react";
import Cookie from "js-cookie";
import { updateToken } from "@/queries/auth/updateToken";
import { requestTokenData } from "@/queries/auth/processToken";

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

export interface AuthContextType {
  registrationState: RegistrationState | undefined,
  userPermission: UserPermissionType | undefined,
  userId: string | undefined
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
      const token = Cookie.get("zanzarah-project-auth-token");
      const email = Cookie.get("zanzarah-project-email");
      const password = Cookie.get("zanzarah-project-password");
      if (token == undefined) {
        if (email != undefined && password != undefined) {
          const updateTokenResult = await updateToken({email: email, password: password});
          if (updateTokenResult != undefined) {
            setRegistrationState(updateTokenResult.registrationState);
            setUserId(updateTokenResult.userId)
            setPermission(updateTokenResult.permission);
            Cookie.set("zanzarah_project-auth-token", updateTokenResult.newToken, {expires: 86400});
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

    return (
      <AuthContext.Provider value={{registrationState: registrationState, userId: userId, userPermission: permission}}>
        {children}
      </AuthContext.Provider>
    )
}

export const useAuth = (): AuthContextType | undefined => {
    const context = use(AuthContext);
    return context;
}

export default AuthProvider;