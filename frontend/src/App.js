import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import CustomerDashboard from './pages/CustomerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BookAppointment from './pages/BookAppointment';
import Payment from './pages/Payment';
import ServiceHistory from './pages/ServiceHistory';
import MechanicDashboard from './pages/MechanicDashboard';

function App() {
    const PrivateRoute = ({ children, role }) => {
        const { user } = useAuth();
        if (!user) return <Navigate to="/login" />;
        if (role && user.role !== role) return <Navigate to="/login" />;
        return children;
    };

    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/customer" element={
                        <PrivateRoute role="customer"><CustomerDashboard /></PrivateRoute>
                    } />
                    <Route path="/admin" element={
                        <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
                    } />
                    <Route path="/mechanic" element={
                        <PrivateRoute role="mechanic"><MechanicDashboard /></PrivateRoute>
                    } />
                    <Route path="/book" element={
                        <PrivateRoute role="customer"><BookAppointment /></PrivateRoute>
                    } />
                    <Route path="/payment/:id" element={
                        <PrivateRoute role="customer"><Payment /></PrivateRoute>
                    } />
                    <Route path="/history" element={
                        <PrivateRoute role="customer"><ServiceHistory /></PrivateRoute>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;