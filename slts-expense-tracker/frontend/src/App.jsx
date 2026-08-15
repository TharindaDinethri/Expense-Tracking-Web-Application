import {
    BrowserRouter,
    Routes,
    Route
} from 'react-router-dom';

import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import Profile from './pages/Profile';

function Private({ children }) {
    return (
        <ProtectedRoute>
            <Layout>
                {children}
            </Layout>
        </ProtectedRoute>
    );
}

export default function App() {

    return (
        <AuthProvider>

            <BrowserRouter>

                <Routes>

                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/register"
                        element={<Register />}
                    />

                    <Route
                        path="/forgot"
                        element={<ForgotPassword />}
                    />

                    <Route
                        path="/"
                        element={
                            <Private>
                                <Dashboard />
                            </Private>
                        }
                    />

                    <Route
                        path="/expenses"
                        element={
                            <Private>
                                <Expenses />
                            </Private>
                        }
                    />

                    <Route
                        path="/income"
                        element={
                            <Private>
                                <Income />
                            </Private>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <Private>
                                <Profile />
                            </Private>
                        }
                    />

                </Routes>

            </BrowserRouter>

        </AuthProvider>
    );
}