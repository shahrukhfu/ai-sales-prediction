/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RegressionModel, PredictionLog } from "../types";
import { motion } from "motion/react";
import {
  TrendingUp,
  Cpu,
  History,
  ArrowRight,
  Brain,
  Sparkles,
  BarChart3,
  CheckCircle2,
  Lock
} from "lucide-react";

interface DashboardViewProps {
  user: { name: string };
  models: RegressionModel[];
  predictions: PredictionLog[];
  onNavigateTab: (tabId: string, modelId?: string) => void;
}

export default function DashboardView({ user, models, predictions, onNavigateTab }: DashboardViewProps) {
  const customModelsCount = models.filter((m) => m.isCustom).length;

  const renderRegressionSVG = () => {
    const width = 360;
    const height = 160;
    const points = [
      { x: 40, y: 130 },
      { x: 80, y: 110 },
      { x: 120, y: 115 },
      { x: 160, y: 80 },
      { x: 200, y: 65 },
      { x: 240, y: 50 },
      { x: 280, y: 35 },
      { x: 320, y: 45 },
    ];
    const startX = 20;
    const startY = 140;
    const endX = 340;
    const endY = 30;

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-slate-400">
        <line x1="20" y1="20" x2="340" y2="20" stroke="#f1f5f9" strokeDasharray="4,4" />
        <line x1="20" y1="60" x2="340" y2="60" stroke="#f1f5f9" strokeDasharray="4,4" />
        <line x1="20" y1="100" x2="340" y2="100" stroke="#f1f5f9" strokeDasharray="4,4" />
        <line x1="20" y1="140" x2="340" y2="140" stroke="#e2e8f0" strokeWidth="1.5" />
        <line x1="20" y1="10" x2="20" y2="140" stroke="#e2e8f0" strokeWidth="1.5" />

        <motion.line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke="url(#grad)"
          strokeWidth="3.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4.5"
            fill="#3b82f6"
            className="hover:scale-150 transition-transform origin-center cursor-pointer"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.3 }}
          />
        ))}

        <line x1="160" y1="80" x2="160" y2="90" stroke="#f43f5e" strokeDasharray="2,2" />

        <defs>
          <linearGradient id="grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="space-y-8 text-left">
      {/* Welcome Banner Card */}
      <div className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 overflow-hidden shadow-xs">
        <div className="absolute top-[-30%] right-[-5%] w-72 h-72 rounded-full bg-blue-500/5 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 rounded-full bg-indigo-500/5 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 mb-4 font-sans">
              <Sparkles className="h-3.5 w-3.5" /> Welcome back
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Hello, {user.name}!
            </h1>
            <p className="text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
              Explore your analytical regression workbench. Run forecasts, calculate multi-variable correlation systems, or initialize custom matrix-solved models.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab("predict")}
            className="px-5 py-3.5 bg-slate-900 hover:bg-slate-950 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-[0.99] transition self-start md:self-center shrink-0"
          >
            Create Prediction <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Overview Analytics Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-xs">
          <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
            <History className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saved Predictions</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{predictions.length}</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-xs">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Models</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{models.length}</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-xs">
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
            <Brain className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Custom Solves</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{customModelsCount}</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-5 shadow-xs">
          <div className="p-3 bg-amber-50 rounded-xl text-amber-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mean R² Level</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {models.length > 0 
                ? (models.reduce((acc, m) => acc + m.r2Score, 0) / models.length).toFixed(3)
                : "0.000"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Regression plot rendering block and stats distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-600" /> Statistical Curve Projections
              </h3>
              <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold">OLS_LIVE</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Visualizes ordinary least squares predictions fitting multi-dimensional fields into an optimized hyper-plane projection.
            </p>
          </div>
          <div className="h-44 bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-center justify-center">
            {renderRegressionSVG()}
          </div>
        </div>

        {/* Quick mathematical review card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between shadow-xs text-white">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-blue-405 uppercase block mb-1">Concept Crash Course</span>
            <h3 className="text-lg font-bold text-white">Ordinary Least Squares (OLS)</h3>
            <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
              The algorithm solves coefficients beta by minimizing the sum of squared differences between real coordinates and fitted plane lines.
            </p>
            <div className="bg-slate-950 rounded-xl border border-slate-800 p-3.5 font-mono text-center text-xs mt-4">
              <span className="text-amber-400">w = (Xᵀ X)⁻¹ Xᵀ Y</span>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("training")}
            className="mt-6 w-full py-3 bg-white/10 hover:bg-white text-white hover:text-slate-900 border border-white/10 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition"
          >
            Launch Matrix Labs <Cpu className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Available Regression Models grid */}
      <div>
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Active Mathematical Models</h2>
            <p className="text-xs text-slate-500 mt-1">Pre-trained or custom-fit multiple regression equations active on this workbench.</p>
          </div>
          {customModelsCount === 0 && (
            <button
              onClick={() => onNavigateTab("training")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition"
            >
              Add Custom Model <ArrowRight className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 transition flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex justify-between items-start gap-4 mb-3.5">
                  <h3 className="text-base font-bold text-slate-800 leading-tight">{model.name}</h3>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full select-none shrink-0 ${
                      model.isCustom
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {model.isCustom ? "Custom OLS" : "Pre-trained"}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mb-4.5 min-h-[48px]">{model.description}</p>

                {/* Micro equation stats list */}
                <div className="space-y-2 mb-6 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Target Target:</span>
                    <strong className="text-slate-705">{model.targetName} ({model.targetUnit})</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Predictor Features:</span>
                    <strong className="text-slate-750">{model.features.length} inputs</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Precision Score R²:</span>
                    <strong className="text-emerald-600 font-bold">{model.r2Score.toFixed(3)}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab("predict", model.id)}
                className="w-full mt-2 py-3 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                Launch Workbench <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
