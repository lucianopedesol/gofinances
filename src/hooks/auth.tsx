import { createContext, ReactNode, useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';


const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

interface IAuthProviderProps {
    children: ReactNode;
}

interface IUser {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user?: IUser;
    userSorageLoading: boolean;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
}

interface IAuthorizationResponse {
    params: {
        access_token: string;
    }
    type: string;
}

export const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: IAuthProviderProps) {
    const [user, setUser] = useState<IUser>()
    const [userSorageLoading, setUserSorageLoading] = useState<boolean>(true);
    const userStorageKey = '@gofinances:user';

    async function signInWithGoogle() {
        try {
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { type, params } = await AuthSession.startAsync({ authUrl }) as IAuthorizationResponse;

            if (type === "success") {

                const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();
                const photo = userInfo?.picture || `https://ui-avatars.com/api/?name=${userInfo.given_name}&length=1`
                const userLogged = {
                    id: userInfo.id,
                    name: userInfo.given_name,
                    email: userInfo.email,
                    photo: photo
                }
                setUser(userLogged);


                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
            }
        } catch (error) {
            throw new Error(String(error));
        }
    }

    async function signInWithApple() {
        try {

            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            });

            if (credential) {
                const name = credential.fullName!.givenName!;
                const photo = `https://ui-avatars.com/api/?name=${name}&length=1`
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                    photo
                };
                setUser(userLogged);

                await AsyncStorage.setItem(userStorageKey, JSON.stringify(userLogged))
            }


        } catch (error) {
            throw new Error(String(error));
        }
    }

    async function signOut() {
        setUser({} as IUser);
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const data = await AsyncStorage.getItem(userStorageKey);
            if (data) {
                const userLogged = JSON.parse(data) as IUser;
                setUser(userLogged);
            }
            setUserSorageLoading(false);
        };

        loadUserStorageData();
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                userSorageLoading,
                signInWithGoogle,
                signInWithApple,
                signOut,
            }}>
            {children}
        </AuthContext.Provider>
    )
}

function useAuth() {
    const contexto = useContext(AuthContext)

    return contexto;
}

export { AuthProvider, useAuth }