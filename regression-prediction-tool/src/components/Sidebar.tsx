/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { User } from "../types";
import {
  LayoutGrid,
  Calculator,
  Cpu,
  History,
  LogOut,
  Menu,
  X,
  TrendingUp,
  User as UserIcon
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function Sidebar({ activeTab, setActiveTab, user, onLogout, children }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", name: "Dashboard", icon: LayoutGrid },
    { id: "predict", name: "Run Predictor", icon: Calculator },
    { id: "training", name: "Model Training Lab", icon: Cpu },
    { id: "history", name: "History Logs", icon: History },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans relative">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-5 py-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-bold text-sm tracking-tight text-white">LinearPredict v2</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition"
          aria-label="Toggle Navigation Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-xs z-30 transition-opacity"
        />
      )}

      {/* Sidebar Navigation Panel (Desktop + Mobile overlay) */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-30 w-64 bg-slate-900 flex flex-col justify-between transform transition-transform duration-300 md:transform-none md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } h-screen overflow-y-auto shrink-0`}
      >
        {/* Core Nav Containers */}
        <div>
          {/* Brand header */}
          <div className="hidden md:flex items-center gap-3 px-6 py-6 border-b border-slate-800">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">LinearPredict v2</span>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                    isActive
                      ? "bg-slate-800 text-white shadow-xs"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 opacity-70 shrink-0" />
                  {item.name}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Plan indicators and User Profile */}
        <div className="p-4 space-y-4">
          {/* Pro Tier Limit Indicator */}
          <div className="bg-slate-800 rounded-2xl p-4 text-left">
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-1.5">Current Plan</p>
            <p className="text-white text-sm font-medium mb-3">Professional Tier</p>
            <div className="w-full bg-slate-700 h-1 rounded-full mb-1">
              <div className="bg-blue-400 h-1 rounded-full w-2/3"></div>
            </div>
            <p className="text-[10px] text-slate-500">670 / 1000 Predictions</p>
          </div>

          {/* User Card */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center gap-3 p-2 bg-slate-950/20 rounded-xl mb-3 text-left">
              <div className="h-9 w-9 bg-slate-800 rounded-lg flex items-center justify-center text-slate-300">
                <UserIcon className="h-4.5 w-4.5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate max-w-[130px]">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate max-w-[130px]">{user.email}</p>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 rounded-xl transition"
            >
              <LogOut className="h-4 w-4" />
              Log Out Account
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50/50 min-h-screen">
        {/* Sleek Theme Top Header Bar */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <div className="text-left">
            <h1 className="text-xl font-bold text-slate-800">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "predict" && "Regression Predictor"}
              {activeTab === "training" && "Model Training Lab"}
              {activeTab === "history" && "History & Logs"}
            </h1>
            <p className="text-sm text-slate-500">
              {activeTab === "dashboard" && `Welcome back, ${user.name}`}
              {activeTab === "predict" && "Evaluate multivariate variables with real-time math feedback"}
              {activeTab === "training" && "Architect and train custom linear formula equation matrix solvers"}
              {activeTab === "history" && "Review, parse, study, and export past predictive computations"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border-2 border-white shadow-md flex items-center justify-center text-white font-bold select-none">
              {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
            </div>
          </div>
        </header>

        {/* Content Area Wrap */}
        <div className="p-8 flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
