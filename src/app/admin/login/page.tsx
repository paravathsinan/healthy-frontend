"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Basic Validation
    if (!username.trim()) {
      setError("Please enter your admin username");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/login/", { username, password });
      const { token } = response.data;
      
      localStorage.setItem("access_token", token);
      document.cookie = `access_token=${token}; path=/; max-age=86400;`;
      
      toast.success("Welcome back, Admin!");
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError(err.response?.data?.error || "The username or password you entered is incorrect. Please try again.");
      } else {
        setError("Unable to connect to the server. Please check your internet or try again later.");
      }
    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4">
      <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative w-16 h-16 transition-transform hover:scale-110 duration-300">
              <Image src="/logo/logo.png" alt="Logo" fill className="object-contain" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-gray-900 font-heading tracking-tight">Admin Login</h2>
          <p className="text-gray-500 font-medium mt-2">Enter your credentials to access the dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-2xl p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm font-bold text-red-800 leading-tight">{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-[11px] font-bold uppercase tracking-widest text-gray-600 ml-1">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error) setError(null);
              }}
              className="rounded-xl h-12 font-semibold bg-white border border-black/10 focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0 transition-all text-gray-900 placeholder:text-gray-400"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-gray-600 ml-1">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                className="rounded-xl h-12 font-semibold bg-white border border-black/10 focus-visible:border-black focus-visible:ring-0 focus-visible:ring-offset-0 transition-all text-gray-900 placeholder:text-gray-400 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>



          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-full bg-[#006837] hover:bg-black font-bold text-white shadow-lg shadow-[#006837]/20 transition-all active:scale-95"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </div>
            ) : "Sign In"}
          </Button>
        </form>

        <div className="text-center pt-4">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Dates & Nuts Admin Security
          </p>
        </div>
      </div>
    </div>
  );
}
