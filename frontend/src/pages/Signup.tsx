import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get('/auth/profile')
            .then(() => navigate('/dashboard'))
    }, [navigate]);


    const submithandler = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            await axiosInstance.post("/auth/signup", { email, password, username });
            setEmail("");
            setPassword("");
            setUsername("");
            navigate("/signin");
        } catch (error) {
            console.error("signup failed:", error);
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
                <input
                    className="outline p-1"
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <button className="bg-gray-500 text-gray-50 p-2 cursor-pointer" type="submit">
                    SignUp
                </button>
            </form>
            <p className="pt-2">Already have an account? <Link to="/signin" className="text-blue-500">SignIn</Link></p>
        </div>
    )
}

export default Signup
