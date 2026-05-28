/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { RegressionModel, TrainingDataPoint } from "../types";
import { trainMultipleLinearRegression, generateMockDataset } from "../utils/math";
import { motion } from "motion/react";
import {
  Cpu,
  Plus,
  Trash2,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Database,
  ArrowRight,
  Info
} from "lucide-react";

interface TrainingLabViewProps {
  onAddCustomModel: (model: RegressionModel) => void;
}

export default function TrainingLabView({ onAddCustomModel }: TrainingLabViewProps) {
  // Config state
  const [modelName, setModelName] = useState("Custom Server Load Predictor");
  const [targetName, setTargetName] = useState("Server CPU Load");
  const [targetUnit, setTargetUnit] = useState("%");

  // Predictor features configurators (Default 3 features)
  const [feature1, setFeature1] = useState({ name: "Concurrent Users", unit: "req/s", min: 100, max: 10000, step: 100 });
  const [feature2, setFeature2] = useState({ name: "Active Processes", unit: "tasks", min: 5, max: 200, step: 1 });
  const [feature3, setFeature3] = useState({ name: "Ambient Datacenter Temp", unit: "°C", min: 10, max: 40, step: 0.5 });

  // Grid Dataset representation
  const [dataset, setDataset] = useState<TrainingDataPoint[]>([]);
  const [fitResult, setFitResult] = useState<{ weights: number[]; intercept: number; r2: number; mse: number } | null>(null);
  const [training, setTraining] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto populate a fully correlated mathematical mockup sample data points
  const handleAutoPopulate = () => {
    setErrorMessage(null);
    setFitResult(null);

    const mockFeatures = [
      { id: "feat1", min: feature1.min, max: feature1.max, coefficient: 0.005 },
      { id: "feat2", min: feature2.min, max: feature2.max, coefficient: 0.18 },
      { id: "feat3", min: feature3.min, max: feature3.max, coefficient: 0.45 },
    ];

    const size = 10;
    const generated = generateMockDataset(mockFeatures, 25.0, size);
    setDataset(generated);
  };

  const handleAddRow = () => {
    const avgF1 = Math.round((feature1.min + feature1.max) / 2);
    const avgF2 = Math.round((feature2.min + feature2.max) / 2);
    const avgF3 = Math.round((feature3.min + feature3.max) / 2);

    const newRow: TrainingDataPoint = {
      id: `dp-custom-${Date.now()}-${Math.random()}`,
      X: [avgF1, avgF2, avgF3],
      Y: 50,
    };

    setDataset((prev) => [...prev, newRow]);
    setFitResult(null);
    setErrorMessage(null);
  };

  const handleUpdateCell = (rowIndex: number, colIndex: number, value: number) => {
    setDataset((prev) => {
      const copy = [...prev];
      const dataRow = { ...copy[rowIndex] };
      const newX = [...dataRow.X];
      newX[colIndex] = isNaN(value) ? 0 : value;
      dataRow.X = newX;
      copy[rowIndex] = dataRow;
      return copy;
    });
    setFitResult(null);
  };

  const handleUpdateTargetCell = (rowIndex: number, value: number) => {
    setDataset((prev) => {
      const copy = [...prev];
      const dataRow = { ...copy[rowIndex], Y: isNaN(value) ? 0 : value };
      copy[rowIndex] = dataRow;
      return copy;
    });
    setFitResult(null);
  };

  const handleDeleteRow = (index: number) => {
    setDataset((prev) => prev.filter((_, idx) => idx !== index));
    setFitResult(null);
    setErrorMessage(null);
  };

  const handleTrainAndBuildModel = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setFitResult(null);

    if (dataset.length < 4) {
      setErrorMessage("Standard Multiple Linear Regression requires at least 4 observations to evaluate predictor weights stably.");
      return;
    }

    setTraining(true);

    setTimeout(() => {
      try {
        const solved = trainMultipleLinearRegression(dataset, 3);
        setFitResult(solved);

        const customModel: RegressionModel = {
          id: `custom-model-${Date.now()}`,
          name: modelName,
          description: `Custom model trained on-the-fly inside the workbench utilizing 3 predictors to evaluate ${targetName} outputs.`,
          targetName,
          targetUnit,
          intercept: Number(solved.intercept.toFixed(4)),
          r2Score: Number(solved.r2.toFixed(4)),
          isCustom: true,
          features: [
            {
              id: "f1",
              name: feature1.name,
              min: feature1.min,
              max: feature1.max,
              step: feature1.step,
              defaultValue: Number(((feature1.min + feature1.max) / 2).toFixed(1)),
              unit: feature1.unit,
              coefficient: Number(solved.weights[0].toFixed(5)),
            },
            {
              id: "f2",
              name: feature2.name,
              min: feature2.min,
              max: feature2.max,
              step: feature2.step,
              defaultValue: Number(((feature2.min + feature2.max) / 2).toFixed(1)),
              unit: feature2.unit,
              coefficient: Number(solved.weights[1].toFixed(5)),
            },
            {
              id: "f3",
              name: feature3.name,
              min: feature3.min,
              max: feature3.max,
              step: feature3.step,
              defaultValue: Number(((feature3.min + feature3.max) / 2).toFixed(1)),
              unit: feature3.unit,
              coefficient: Number(solved.weights[2].toFixed(5)),
            },
          ],
        };

        onAddCustomModel(customModel);
      } catch (err: any) {
        setErrorMessage(err.message || "Numerical analysis failed due to collinearities or insufficient data density.");
      } finally {
        setTraining(false);
      }
    }, 1000);
  };

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Step 1: Settings Configurator Row */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
            <h2 className="text-sm font-bold tracking-wider uppercase text-slate-800 mb-5 flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-blue-600" /> 1. Configure Variable Schema
            </h2>

            {/* Target Variable Definition */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase tracking-widest mb-1 shadow-xs">Model Name</label>
                <input
                  type="text"
                  value={modelName}
                  onChange={(e) => setModelName(e.target.value)}
                  placeholder="E.g. CPU temperature forecasting"
                  className="w-full bg-slate-50 border border-slate-205 focus:border-slate-400 focus:bg-white text-sm py-2 px-3.5 rounded-xl font-medium text-slate-800 outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-455 uppercase tracking-widest mb-1">Target (Y)</label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    placeholder="CPU Temperature"
                    className="w-full bg-slate-50 border border-slate-205 focus:border-slate-400 focus:bg-white text-xs py-2 px-3 rounded-xl font-medium text-slate-800 outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-455 uppercase tracking-widest mb-1">Target Unit</label>
                  <input
                    type="text"
                    value={targetUnit}
                    onChange={(e) => setTargetUnit(e.target.value)}
                    placeholder="°C"
                    className="w-full bg-slate-50 border border-slate-205 focus:border-slate-400 focus:bg-white text-xs py-2 px-3 rounded-xl font-medium text-slate-800 outline-hidden font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Predictor Configuration items */}
            <div className="space-y-4 mt-6 pt-5 border-t border-slate-200">
              <span className="block text-xs font-extrabold text-slate-450 uppercase tracking-wider">Independent Inputs (X)</span>

              {/* Predictor 1 */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-blue-600 block pb-1">FEATURE X1</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={feature1.name}
                    onChange={(e) => setFeature1({ ...feature1, name: e.target.value })}
                    className="bg-white border border-slate-200 text-xs font-bold p-1.5 rounded text-slate-800 focus:border-slate-400 outline-hidden"
                  />
                  <input
                    type="text"
                    value={feature1.unit}
                    placeholder="Unit"
                    onChange={(e) => setFeature1({ ...feature1, unit: e.target.value })}
                    className="bg-white border border-slate-200 text-xs p-1.5 rounded text-slate-500 focus:border-slate-400 outline-hidden"
                  />
                </div>
              </div>

              {/* Predictor 2 */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-blue-600 block pb-1">FEATURE X2</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={feature2.name}
                    onChange={(e) => setFeature2({ ...feature2, name: e.target.value })}
                    className="bg-white border border-slate-200 text-xs font-bold p-1.5 rounded text-slate-800 focus:border-slate-400 outline-hidden"
                  />
                  <input
                    type="text"
                    value={feature2.unit}
                    placeholder="Unit"
                    onChange={(e) => setFeature2({ ...feature2, unit: e.target.value })}
                    className="bg-white border border-slate-200 text-xs p-1.5 rounded text-slate-500 focus:border-slate-400 outline-hidden"
                  />
                </div>
              </div>

              {/* Predictor 3 */}
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <span className="text-[10px] font-mono font-bold text-blue-600 block pb-1">FEATURE X3</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={feature3.name}
                    onChange={(e) => setFeature3({ ...feature3, name: e.target.value })}
                    className="bg-white border border-slate-200 text-xs font-bold p-1.5 rounded text-slate-800 focus:border-slate-400 outline-hidden"
                  />
                  <input
                    type="text"
                    value={feature3.unit}
                    placeholder="Unit"
                    onChange={(e) => setFeature3({ ...feature3, unit: e.target.value })}
                    className="bg-white border border-slate-200 text-xs p-1.5 rounded text-slate-500 focus:border-slate-400 outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Tabular Observations Matrix Editor */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-start">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-sm font-bold tracking-wider uppercase text-slate-800 flex items-center gap-2">
                  <Database className="h-4.5 w-4.5 text-blue-600" /> 2. Feed Training Observation Rows
                </h2>
                <p className="text-[11px] text-slate-405 mt-1">Provide at least 4 database records to perform multiple correlation fitting calculations.</p>
              </div>

              <div className="flex gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAutoPopulate}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition select-none cursor-pointer shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-blue-600" /> Auto-Generate
                </button>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition select-none cursor-pointer shadow-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Row
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4.5 bg-rose-50 border border-rose-150 text-rose-700 text-xs px-4 py-3 rounded-xl leading-relaxed font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Matrix Data Table Grid */}
            {dataset.length > 0 ? (
              <div className="overflow-x-auto rounded-xl border border-slate-200/90 bg-slate-50/50 max-h-80 overflow-y-auto">
                <table className="w-full text-xs text-left" role="grid">
                  <thead className="bg-slate-100 text-[10px] font-bold tracking-widest uppercase text-slate-500 border-b border-slate-200">
                    <tr role="row">
                      <th className="py-3 px-4">Row</th>
                      <th className="py-3 px-3 uppercase truncate max-w-[130px]" title={feature1.name}>X₁: {feature1.name}</th>
                      <th className="py-3 px-3 uppercase truncate max-w-[130px]" title={feature2.name}>X₂: {feature2.name}</th>
                      <th className="py-3 px-3 uppercase truncate max-w-[130px]" title={feature3.name}>X₃: {feature3.name}</th>
                      <th className="py-3 px-3 uppercase text-blue-600 truncate max-w-[130px]" title={targetName}>Y: {targetName}</th>
                      <th className="py-3 px-4 text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {dataset.map((row, rIdx) => (
                      <tr key={row.id} className="hover:bg-slate-200/20 transition-colors" role="row">
                        <td className="py-2 px-4 font-mono text-[10px] text-slate-400">#{rIdx + 1}</td>
                        {row.X.map((val, cIdx) => (
                          <td key={cIdx} className="py-2 px-3">
                            <input
                              type="number"
                              value={val}
                              onChange={(e) => handleUpdateCell(rIdx, cIdx, parseFloat(e.target.value))}
                              className="w-full bg-white border border-slate-200 focus:border-slate-405 text-xs rounded-lg px-2 py-1 font-mono text-slate-800 text-right font-semibold"
                            />
                          </td>
                        ))}
                        <td className="py-2 px-3 font-semibold text-blue-605">
                          <input
                            type="number"
                            value={row.Y}
                            onChange={(e) => handleUpdateTargetCell(rIdx, parseFloat(e.target.value))}
                            className="w-full bg-blue-50/50 border border-blue-200/80 focus:border-blue-400 text-xs rounded-lg px-2 py-1 font-mono text-blue-700 text-right font-bold"
                          />
                        </td>
                        <td className="py-2 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(rIdx)}
                            className="p-1 text-slate-400 hover:text-rose-500 transition"
                            title="Delete observation row"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              // Empty Matrix panel placeholder
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-10 text-center my-2">
                <Database className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-xs font-bold uppercase text-slate-600 tracking-wider">Empty Matrix Board</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">No training rows loaded. Fill records manually, or click 'Auto-Generate' to populate a pre-correlated sandbox simulation dataset.</p>
              </div>
            )}

            {/* Run Train Solving Buttons */}
            {dataset.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-450 font-mono">
                  <Info className="h-4 w-4 text-slate-405 shrink-0" />
                  <span>Observations: <strong className="text-slate-800 font-bold">{dataset.length}</strong> / 4 required</span>
                </div>

                <button
                  type="button"
                  onClick={handleTrainAndBuildModel}
                  disabled={training || dataset.length < 4}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-950 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs transition shrink-0 active:scale-[0.99] cursor-pointer"
                >
                  {training ? (
                    <>
                      <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Solving Matrices (OLS)...</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="h-4 w-4" />
                      <span>Compute ordinary least squares</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Training solver success layout card */}
          {fitResult !== null && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xl relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 h-28 w-28 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start gap-3.5">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-slate-900">Custom Model Solved Successfully!</h3>
                  <p className="text-xs text-slate-450 mt-1 leading-relaxed">
                    The regression compiler evaluated the coordinate plane, computed coefficient weights, and loaded your model into the predicting workbench.
                  </p>
                </div>
              </div>

              {/* Parameter results listing table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6 pt-5 border-t border-slate-100">
                {/* Weight coefficients */}
                <div>
                  <span className="text-[10px] font-bold text-slate-450 tracking-wider block mb-2 px-1 uppercase font-mono">SOLVED WEIGHT ENGINES</span>
                  <div className="space-y-2 text-xs font-mono bg-slate-50 p-4 border border-slate-100 rounded-xl">
                    <div className="flex justify-between">
                      <span className="text-slate-450">Intercept (β₀ Bias)</span>
                      <strong className="text-emerald-600 font-bold">{fitResult.intercept.toFixed(4)}</strong>
                    </div>
                    <div className="flex justify-between truncate" title={feature1.name}>
                      <span className="text-slate-450 max-w-[150px] truncate">{feature1.name} (w₁)</span>
                      <strong className="text-slate-800 font-bold">{fitResult.weights[0].toFixed(5)}</strong>
                    </div>
                    <div className="flex justify-between truncate" title={feature2.name}>
                      <span className="text-slate-455 max-w-[150px] truncate">{feature2.name} (w₂)</span>
                      <strong className="text-slate-800 font-bold">{fitResult.weights[1].toFixed(5)}</strong>
                    </div>
                    <div className="flex justify-between truncate" title={feature3.name}>
                      <span className="text-slate-455 max-w-[150px] truncate">{feature3.name} (w₃)</span>
                      <strong className="text-slate-800 font-bold">{fitResult.weights[2].toFixed(5)}</strong>
                    </div>
                  </div>
                </div>

                {/* Math R2 precision coefficients */}
                <div className="flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-450 tracking-wider block mb-2 px-1 uppercase font-mono">DENSITY METRICS</span>
                    <div className="space-y-2 text-xs font-mono bg-slate-50 p-4 border border-slate-100 rounded-xl">
                      <div className="flex justify-between">
                        <span className="text-slate-450">R² Coefficient</span>
                        <strong className="text-emerald-600 font-bold">{fitResult.r2.toFixed(5)}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-450">Mean Square Error</span>
                        <strong className="text-amber-600 font-bold">{fitResult.mse.toFixed(4)}</strong>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-bold mt-4 shrink-0 hover:text-blue-700 transition">
                    Active on workbench! <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
