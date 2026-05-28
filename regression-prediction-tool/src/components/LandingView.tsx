/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { TrendingUp, ArrowRight, Play, LineChart, Cpu, BarChart3, Database } from "lucide-react";

interface LandingViewProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export default function LandingView({ onGetStarted, onLogin }: LandingViewProps) {
  const features = [
    {
      icon: LineChart,
      title: "Interactive Predictions",
      description: "Tweak variables in real-time with responsive sliders and immediately calculate outputs with clear mathematical weight breakdowns.",
    },
    {
      icon: Cpu,
      title: "Custom OLS Solver Engine",
      description: "Define custom independent variables and train your own regression model on-the-fly using a robust Ordinary Least Squares matrix engine.",
    },
    {
      icon: BarChart3,
      title: "Deep Equation Visualizations",
      description: "Understand the 'why' behind calculations. Inspect coefficients, intercepts, determination R² levels, and feature contribution charts.",
    },
    {
      icon: Database,
      title: "Persistent Query Logs",
      description: "Log past predictions with multi-filter historical registers, data download triggers, and persistent tracking across workspace environments.",
    },
  ];

  return (
    <div id="landing-page" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans relative overflow-hidden">
      {/* Decorative Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-50 pointer-events-none" />

      {/* Decorative Blur Circles */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-500/5 blur-[130px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative max-w-7xl mx-auto w-full px-6 py-5 flex items-center justify-between border-b border-slate-200 z-10 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md shadow-blue-500/20">
            <TrendingUp className="h-4.5 w-4.5 text-white" />
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-slate-800">
            Advertising Sales Predictor
          </span>
        </div>
        <button
          onClick={onLogin}
          className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-slate-950 border border-slate-200 hover:border-slate-400 bg-white shadow-xs rounded-xl transition"
        >
          Sign In
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-20 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        <div className="flex-1 text-left">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
              Polynomial Regression Engine
            </span>
          </motion.div>

          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            Optimize Advertising ROI with{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Precision Mathematics
            </span>
          </motion.h1>

          <motion.p
            className="text-base sm:text-lg text-slate-500 leading-relaxed mb-10 max-w-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Predict product sales accurately based on TV, Radio, and Newspaper advertising budgets. Avoid overspending by identifying diminishing returns using non-linear math.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-slate-800 hover:bg-slate-900 text-white font-semibold rounded-xl flex items-center justify-center gap-2.5 shadow-md shadow-slate-900/10 active:scale-[0.99] transition"
            >
              Get Started Free <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onLogin}
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-xl flex items-center justify-center gap-2.5 shadow-xs hover:border-slate-300 active:scale-[0.99] transition"
            >
              <Play className="h-4 w-4 fill-current text-slate-600" /> Play Sandbox
            </button>
          </motion.div>
        </div>

        {/* Dynamic Graphic UI Preview Card */}
        <div className="flex-1 w-full max-w-md lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white border border-slate-200/80 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
          >
            {/* Visual Title bar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-450" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="font-mono text-[10px] text-slate-400 font-bold tracking-wider">OLS_SOLVER_DUMMY_VIZ</span>
            </div>

            {/* Simulated Live Equation Banner */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 mb-6 text-center">
              <span className="font-mono text-[10px] text-slate-450 block mb-1 font-semibold uppercase tracking-wider">REGRESSION FORMULA</span>
              <span className="font-mono text-xs sm:text-sm font-bold text-blue-600 tracking-tight">
                Sales = 5.15 + 0.07·TV - 0.03·Radio + Poly...
              </span>
            </div>

            {/* Realistic Coefficient Multiplots */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                  <span>TV Budget (X₁)</span>
                  <span className="text-emerald-600 font-bold">+0.076 coefficient</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "85%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                  <span>Radio Budget (X₂)</span>
                  <span className="text-rose-500 font-bold">-0.031 coefficient</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "35%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-slate-500 mb-1">
                  <span>Newspaper Budget (X₃)</span>
                  <span className="text-rose-500 font-bold">-0.001 coefficient</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: "5%" }} />
                </div>
              </div>
            </div>

            {/* Live Model R-Squared Widget */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400 font-mono font-semibold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>R² Score: <span className="text-slate-700 font-bold">0.94</span></span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                <span>MSE: <span className="text-slate-700 font-bold">12.04</span></span>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Feature Grid Section */}
      <section className="relative max-w-7xl mx-auto w-full px-6 py-16 border-t border-slate-200 z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-850 mb-4">Powerful Features for Predictive Excellence</h2>
          <p className="text-slate-500 text-sm sm:text-base">Everything you need to configure, evaluate, train, and study multiple linear regression analytics models.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:shadow-md hover:border-slate-300 transition-all text-left"
            >
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit mb-5 transition">
                <feat.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-2">{feat.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Educational Guide Footer Banner */}
      <section className="max-w-7xl mx-auto w-full px-6 pb-20 pt-8 relative z-10">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-4xl mx-auto relative overflow-hidden flex flex-col items-center shadow-xl">
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
          <h3 className="text-2xl font-bold text-white mb-3">Understanding the Mathematical Paradigm</h3>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mb-8 leading-relaxed">
            In Polynomial Regression, we relate a single target variable $Y$ to multiple predictors and their interactions like so:
            <br />
            <span className="font-mono text-blue-300 select-all block mt-4 bg-slate-950 py-3 rounded-xl border border-slate-800 px-4 scale-95 origin-center text-sm md:text-base">
              Y = β₀ + β₁X₁ + ... + β₄X₁² + β₅X₁X₂ + ε
            </span>
          </p>
          <button
            onClick={onGetStarted}
            className="px-6 py-3 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-xl flex items-center gap-2 border border-slate-200 transition"
          >
            Launch Prediction Workbench <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
