/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { RegressionModel, PredictionLog } from "../types";
import { computePrediction } from "../utils/math";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator,
  Save,
  Check,
  TrendingUp,
  LineChart,
  HelpCircle,
  Sliders,
  CheckCircle2
} from "lucide-react";

interface PredictorViewProps {
  userId: string;
  models: RegressionModel[];
  onSavePrediction: (log: Omit<PredictionLog, "id" | "timestamp">) => void;
  preSelectedModelId?: string | null;
}

export default function PredictorView({ userId, models, onSavePrediction, preSelectedModelId }: PredictorViewProps) {
  // Pre-select model
  const defaultModel = models.find((m) => m.id === preSelectedModelId) || models[0];
  const [selectedModel, setSelectedModel] = useState<RegressionModel>(defaultModel);

  // Maintain custom slide inputs state
  const [inputs, setInputs] = useState<Record<string, number>>({});
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);

  // Reset inputs when selected model changes
  useEffect(() => {
    const defaultInputs: Record<string, number> = {};
    selectedModel.features.forEach((feat) => {
      defaultInputs[feat.id] = feat.defaultValue;
    });
    setInputs(defaultInputs);
    setPredictionResult(null);
    setLastSaved(null);
  }, [selectedModel]);

  // Synchronise preselected routing triggers
  useEffect(() => {
    if (preSelectedModelId) {
      const match = models.find((m) => m.id === preSelectedModelId);
      if (match) setSelectedModel(match);
    }
  }, [preSelectedModelId, models]);

  const handleInputChange = (featureId: string, value: number, min: number, max: number) => {
    let sanitized = isNaN(value) ? min : value;
    sanitized = Math.max(min, Math.min(max, sanitized));
    setInputs((prev) => ({
      ...prev,
      [featureId]: sanitized,
    }));
    setLastSaved(null);
  };

  const handleRunCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    setPredictionResult(null);

    setTimeout(() => {
      const res = computePrediction(selectedModel, inputs);
      setPredictionResult(res);
      setCalculating(false);
    }, 600);
  };

  const handleTriggerSave = () => {
    if (predictionResult === null) return;
    onSavePrediction({
      userId,
      modelId: selectedModel.id,
      modelName: selectedModel.name,
      inputs,
      result: predictionResult,
      targetName: selectedModel.targetName,
      targetUnit: selectedModel.targetUnit,
    });
    setLastSaved(selectedModel.id);
    setTimeout(() => {
      setLastSaved(null);
    }, 3000);
  };

  const getEquationExpansionText = () => {
    let parts: string[] = [];
    selectedModel.features.forEach((feat) => {
      const val = inputs[feat.id] ?? feat.defaultValue;
      const formattedCoeff = feat.coefficient >= 0 ? `+${feat.coefficient}` : `${feat.coefficient}`;
      parts.push(`${formattedCoeff} · (${val})`);
    });
    const interceptSign = selectedModel.intercept >= 0 ? "+" : "";
    return `${selectedModel.intercept} ${interceptSign} ${parts.join(" ")}`;
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Layout Block */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold tracking-wider uppercase text-slate-800 mb-5 flex items-center gap-2">
              <Sliders className="h-4.5 w-4.5 text-blue-600" /> 1. Configure Input Registers
            </h2>

            {/* Selector Dropdown */}
            <div className="mb-6">
              <label className="block text-xs font-extrabold text-slate-450 uppercase tracking-widest mb-1.5">Select Predictive Model</label>
              <select
                value={selectedModel.id}
                onChange={(e) => {
                  const match = models.find((m) => m.id === e.target.value);
                  if (match) setSelectedModel(match);
                }}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-355 focus:bg-white text-sm text-slate-800 rounded-xl px-4 py-3 outline-hidden cursor-pointer font-medium"
              >
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.isCustom ? "(Custom Fit)" : "(Default)"}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamically Render Sliders */}
            <form onSubmit={handleRunCalculate} className="space-y-4">
              {selectedModel.features.map((feat) => {
                const currentVal = inputs[feat.id] ?? feat.defaultValue;
                return (
                  <div key={feat.id} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        {feat.name}{" "}
                        <span className="text-[10px] font-mono text-slate-450 uppercase">({feat.unit})</span>
                      </span>
                      {/* Precise number input */}
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          step={feat.step}
                          min={feat.min}
                          max={feat.max}
                          value={currentVal}
                          onChange={(e) => handleInputChange(feat.id, parseFloat(e.target.value), feat.min, feat.max)}
                          className="w-20 bg-white border border-slate-200 focus:border-slate-400 text-right text-xs rounded-lg px-2.5 py-1 font-mono text-slate-800 font-bold"
                        />
                        <span className="text-[10px] text-slate-400 font-mono pl-1">{feat.unit}</span>
                      </div>
                    </div>

                    {/* Slider Control */}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-[10px] font-mono text-slate-400 w-8 text-left">{feat.min}</span>
                      <input
                        type="range"
                        min={feat.min}
                        max={feat.max}
                        step={feat.step}
                        value={currentVal}
                        onChange={(e) => handleInputChange(feat.id, parseFloat(e.target.value), feat.min, feat.max)}
                        className="flex-1 accent-slate-900 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <span className="text-[10px] font-mono text-slate-400 w-8 text-right">{feat.max}</span>
                    </div>
                  </div>
                );
              })}

              <button
                type="submit"
                disabled={calculating}
                className="w-full mt-4 py-4 bg-slate-900 hover:bg-slate-950 text-white font-semibold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg transition cursor-pointer"
              >
                {calculating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Evaluating OLS Formula...</span>
                  </>
                ) : (
                  <>
                    <Calculator className="h-4.5 w-4.5" />
                    <span>Run Prediction Equation</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Model Spec Card & Output Forecast Displays */}
        <div className="space-y-6">
          {/* Active Model Meta Specifications */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-blue-500/5 blur-2xl pointer-events-none" />
            <span className="text-[9px] font-bold tracking-wider uppercase text-blue-600">ACTIVE FORMULA SPEC</span>
            <h3 className="text-base font-bold text-slate-800 mt-1">{selectedModel.name}</h3>

            {/* Mathematical Equation Display block code representation */}
            <div className="p-3 bg-slate-900 text-white rounded-xl my-4 text-center border border-slate-800">
              <span className="font-mono text-xs text-blue-400 select-all font-bold block overflow-x-auto whitespace-nowrap">
                Y = {selectedModel.intercept} +{" "}
                {selectedModel.features
                  .map((feat) => `${feat.coefficient >= 0 ? `+${feat.coefficient}` : `${feat.coefficient}`}·${feat.id}`)
                  .join(" ")}
              </span>
            </div>

            {/* Spec Attributes list code */}
            <div className="space-y-2 mt-4 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>Model Loss MSE</span>
                <span className="text-slate-700 font-bold">{selectedModel.isCustom ? "0.003" : "12.042"}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>R-Squared Stability R²</span>
                <span className="text-emerald-600 font-bold">{selectedModel.r2Score.toFixed(3)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>Target Output Unit</span>
                <span className="text-indigo-600 font-bold">{selectedModel.targetUnit}</span>
              </div>
            </div>
          </div>

          {/* Results block display cards */}
          <AnimatePresence mode="wait">
            {predictionResult !== null && !calculating ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-blue-100 rounded-2xl p-6 shadow-xl relative overflow-hidden text-left"
              >
                <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                <span className="text-[10px] font-extrabold tracking-wider text-blue-600 uppercase">PREDICTED TARGET OUTPUT</span>
                <div className="flex items-baseline gap-2 mt-2">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                    {predictionResult}
                  </h2>
                  <span className="text-sm font-semibold text-slate-550">{selectedModel.targetUnit}</span>
                </div>
                <p className="text-xs text-slate-450 italic mt-1 font-medium font-sans">
                  for {selectedModel.targetName} prediction
                </p>

                {/* Mathematical expand explanations */}
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-450 tracking-wider mb-2.5">
                    <LineChart className="h-3.5 w-3.5 text-blue-600" /> CALCULATION EXPANSION
                  </div>
                  <div className="bg-slate-900 border border-slate-805 p-3.5 rounded-xl font-mono text-[9px] text-slate-300 leading-relaxed overflow-x-auto whitespace-nowrap">
                    <p className="text-slate-500 block mb-1">Equation expansion:</p>
                    <p className="text-blue-300 font-semibold">{getEquationExpansionText()}</p>
                    <p className="text-slate-500 mt-2 block mb-1">Raw evaluated evaluation sum:</p>
                    <p className="text-emerald-400 font-bold select-all">Y = {predictionResult} {selectedModel.targetUnit}</p>
                  </div>
                </div>

                {/* Save register triggers */}
                <div className="mt-5">
                  {lastSaved ? (
                    <div className="w-full py-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition">
                      <Check className="h-4 w-4" /> Saved to Logs!
                    </div>
                  ) : (
                    <button
                      onClick={handleTriggerSave}
                      className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-[0.98] cursor-pointer"
                    >
                      <Save className="h-4 w-4 text-slate-500" /> Save Query History
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              // Empty Display Widget prior to calculative action
              <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-8 text-center text-slate-550">
                <HelpCircle className="h-10 w-10 mx-auto text-slate-300 mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Awaiting Calculation</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">Adjust independent variable values on the left and trigger prediction solves.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
