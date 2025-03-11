import React from 'react';
import { Link } from 'react-router-dom';

export default function Header({ user }) {
    return (
        <nav>
            <Link to="/">Sign Up</Link>
            <Link to="/login">Login</Link>
            {user && (
                <>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/auto-report">Auto Report</Link>
                    <Link to="/payment">Payment</Link>
                </>
            )}
        </nav>
    );
}
