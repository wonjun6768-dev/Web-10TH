import { createContext, useContext, useState, type PropsWithChildren } from "react";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LOCAL_STORAGE_KEY } from "../constants/key";

interface AuthContextType {
    accessToken: string | null;
    refreshToken: string | null;
    setAccessToken: (token: string | null) => void;
    setRefreshToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    accessToken: null,
    refreshToken: null,
    setAccessToken: () => {},
    setRefreshToken: () => {},
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
    const {
        getItem: getAccessTokenFromStorage,
        setItem: setAccessTokenToStorage,
        removeItem: removeAccessTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.accessToken);

    const {
        getItem: getRefreshTokenFromStorage,
        setItem: setRefreshTokenToStorage,
        removeItem: removeRefreshTokenFromStorage,
    } = useLocalStorage(LOCAL_STORAGE_KEY.refreshToken);

    const [accessToken, setAccessTokenState] = useState<string | null>(() => getAccessTokenFromStorage());
    const [refreshToken, setRefreshTokenState] = useState<string | null>(() => getRefreshTokenFromStorage());

    const setAccessToken = (token: string | null) => {
        if (token) {
            setAccessTokenToStorage(token);
        } else {
            removeAccessTokenFromStorage();
        }
        setAccessTokenState(token);
    };

    const setRefreshToken = (token: string | null) => {
        if (token) {
            setRefreshTokenToStorage(token);
        } else {
            removeRefreshTokenFromStorage();
        }
        setRefreshTokenState(token);
    };

    return (
        <AuthContext.Provider value={{ accessToken, refreshToken, setAccessToken, setRefreshToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("AuthContext를 찾을 수 없습니다.");
    }
    return context;
};