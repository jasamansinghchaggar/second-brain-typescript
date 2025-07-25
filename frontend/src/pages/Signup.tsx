import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { ModeToggle } from "@/components/mode-toggle";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="w-full max-w-md p-6 rounded-lg">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-semibold mb-2">
            Create a new account
          </h1>
          <p className="text-gray-500 text-md">
            Enter your email, username, and password below
          </p>
        </div>
        <form onSubmit={submithandler} className="flex flex-col space-y-4 mb-4">
          <div>
            <label htmlFor="email" className="block mb-1 text-sm">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className=""
            />
          </div>
          <div>
            <label htmlFor="username" className="block mb-1 text-sm">
              Username
            </label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              required
              className=""
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-1 text-sm">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className=""
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </form>
        <p className="text-md">
          <span className="text-gray-500">
            Already have an account?{" "}
          </span>
          <Link to="/signin" className="underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup
