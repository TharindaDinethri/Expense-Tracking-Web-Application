import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

import { api } from '../services/api';

const C = createContext(null);

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (localStorage.getItem('token')) {

            api('/auth/profile')
                .then(setUser)
                .catch(() => {
                    localStorage.removeItem('token');
                })
                .finally(() => {
                    setLoading(false);
                });

        } else {

            setLoading(false);
        }

    }, []);

    const login = async (data) => {

        const response = await api(
            '/auth/login',
            {
                method: 'POST',
                body: data,
                auth: false
            }
        );

        localStorage.setItem(
            'token',
            response.token
        );

        setUser(response.user);
    };

    const register = async (data) => {

        const response = await api(
            '/auth/register',
            {
                method: 'POST',
                body: data,
                auth: false
            }
        );

        localStorage.setItem(
            'token',
            response.token
        );

        setUser(response.user);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const logout = () => {

        localStorage.removeItem('token');

        setUser(null);
    };

    return (
        <C.Provider
            value={{
                user,
                loading,
                login,
                register,
                updateUser,
                logout
            }}
        >
            {children}
        </C.Provider>
    );
}

export const useAuth = () => useContext(C);