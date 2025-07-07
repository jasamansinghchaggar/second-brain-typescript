import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance.ts";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState("jsc@gmail.com");
    const [password, setPassword] = useState("Jsc@123");
    const navigate = useNavigate();
    useEffect(() => {
        axiosInstance.get('/auth/profile')
            .then(() => navigate('/dashboard'))
    }, [navigate]);

    const submithandler = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await axiosInstance.post("/auth/signin", { email, password });
            setEmail("");
            setPassword("");
            navigate("/dashboard");
        } catch (error) {
            console.error("signin failed:", error);
        }
    };

    return (
        <div className="p-6">
            <h1 className="pb-2 text-2xl font-bold">Login Page</h1>
            <form className="w-[20rem] flex flex-col gap-4" onSubmit={submithandler}>
                <input
                    className="outline p-1"
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className="outline p-1"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="bg-gray-500 text-gray-50 p-2 cursor-pointer" type="submit">
                    SignIn
                </button>
            </form>
            <p className="pt-2">Don't have an account? <Link to="/signup" className="text-blue-500">SignUp</Link></p>
        </div>
    );
};

export default Login;