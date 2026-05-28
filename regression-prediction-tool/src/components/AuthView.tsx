/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User } from "../types";
import { motion } from "motion/react";
import { Lock, Mail, User as UserIcon, ArrowRight, Activity, TrendingUp } from "lucide-react";

interface AuthViewProps {
  initialMode: "login" | "register";
  onAuthSuccess: (user: User) => void;
  onBackToHome: () => void;
}

export default function AuthView({ initialMode, onAuthSuccess, onBackToHome }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Auto pre-fill demo account details
  const prefillDemoAccount = () => {
    setEmail("demo@regression.tool");
    setPassword("regression101");
    if (mode === "register") {
      setName("Sarah Analyst");
    }
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || (mode === "register" && !name)) {
      setError("Please fill out all required fields.");
      return;
    }

    setLoading(true);

    // Simulate standard authentications and local triggers
    setTimeout(() => {
      setLoading(false);

      if (mode === "login") {
        // Mock standard account check or demo account values
        const storedUsers = JSON.parse(localStorage.getItem("regression_users") || "[]");
        const foundUser = storedUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (email.toLowerCase() === "demo@regression.tool" && password === "regression101") {
          const demoUser: User = { id: "user-demo", name: "Sarah Analyst", email: "demo@regression.tool" };
          localStorage.setItem("regression_current_user", JSON.stringify(demoUser));
          onAuthSuccess(demoUser);
        } else if (foundUser && foundUser.password === password) {
          const authenticatedUser: User = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
          localStorage.setItem("regression_current_user", JSON.stringify(authenticatedUser));
          onAuthSuccess(authenticatedUser);
        } else {
          setError("Invalid email or password combination.");
        }
      } else {
        // Registration mode
        const storedUsers = JSON.parse(localStorage.getItem("regression_users") || "[]");
        const exists = storedUsers.some((u: any) => u.email.toLowerCase() === email.toLowerCase());

        if (exists || email.toLowerCase() === "demo@regression.tool") {
          setError("An account with this email address already exists.");
          return;
        }

        const newUserObj = {
          id: `user-${Date.now()}`,
          name,
          email,
          password,
        };

        storedUsers.push(newUserObj);
        localStorage.setItem("regression_users", JSON.stringify(storedUsers));

        const user: User = { id: newUserObj.id, name: newUserObj.name, email: newUserObj.email };
        localStorage.setItem("regression_current_user", JSON.stringify(user));
        onAuthSuccess(user);
      }
    }, 850);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center font-sans p-4 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Short back anchor */}
        <button
          onClick={onBackToHome}
          className="group mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 hover:text-slate-900 transition"
        >
          <span className="text-sm transition-transform group-hover:-translate-x-1">←</span> Back to Overview
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl shadow-slate-200/80 p-8">
          {/* Logo Heading */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="h-11 w-11 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-3 cursor-pointer" onClick={onBackToHome}>
              <TrendingUp className="h-5.5 w-5.5 text-white" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {mode === "login" ? "Sign in to LinearPredict" : "Create your Account"}
            </h2>
            <p className="text-xs text-slate-400 mt-1.5 max-w-xs leading-relaxed">
              {mode === "login"
                ? "Enter your credentials to manage variables, custom models, and logs prediction panels."
                : "Register a predictive account with name, secure email, and passcode."}
            </p>
          </div>

          {/* Quick Sandbox Account Fill Callout */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-1 px-2 text-[9px] font-bold uppercase select-none bg-blue-600 text-white rounded mt-0.5">
                DEMO
              </div>
              <div className="flex-1 text-left">
                <p className="text-xs font-semibold text-blue-900">Sandbox Trial Mode Available</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Skip registering! Click to pre-fill our fully populated demo dashboard workspace instantly.</p>
                <button
                  type="button"
                  onClick={prefillDemoAccount}
                  className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition"
                >
                  Pre-fill Demo Data <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 bg-rose-50 border border-rose-100 text-rose-600 text-xs px-4 py-3 rounded-lg text-left font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-405">
                    <UserIcon className="h-4.5 w-4.5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Sarah Analyst"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3 outline-hidden transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-405">
                  <Mail className="h-4.5 w-4.5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3 outline-hidden transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-405">
                  <Lock className="h-4.5 w-4.5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white text-sm text-slate-800 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3 outline-hidden transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 bg-slate-900 hover:bg-slate-950 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing Engine...</span>
                </div>
              ) : (
                <span>{mode === "login" ? "Sign In" : "Register Credentials"}</span>
              )}
            </button>
          </form>

          {/* Switch Switch Link text */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-450">
            {mode === "login" ? (
              <span>
                Don't have an analytical log account?{" "}
                <button
                  onClick={() => {
                    setMode("register");
                    setError(null);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-bold transition"
                >
                  Sign up free
                </button>
              </span>
            ) : (
              <span>
                Already registered with us?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                  }}
                  className="text-blue-600 hover:text-blue-700 font-bold transition"
                >
                  Log in details
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
