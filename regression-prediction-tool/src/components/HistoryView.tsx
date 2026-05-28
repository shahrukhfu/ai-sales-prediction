/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { PredictionLog, RegressionModel } from "../types";
import {
  History,
  Trash2,
  Download,
  Search,
  ArrowRight,
  Calculator,
  AlertCircle
} from "lucide-react";

interface HistoryViewProps {
  predictions: PredictionLog[];
  models: RegressionModel[];
  onDeletePrediction: (id: string) => void;
  onClearAllPredictions: () => void;
  onNavigateTab: (tabId: string, modelId?: string) => void;
}

export default function HistoryView({
  predictions,
  models,
  onDeletePrediction,
  onClearAllPredictions,
  onNavigateTab,
}: HistoryViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [modelFilter, setModelFilter] = useState("all");

  const handleCreateCSVAndDownload = () => {
    if (predictions.length === 0) return;

    let csvRows = [
      ["Timestamp", "Predictive Model", "Inputs Summary", "Result Output", "Output Target", "Unit"].join(","),
    ];

    predictions.forEach((pred) => {
      const matchedModel = models.find((m) => m.id === pred.modelId);
      let inputsText = "";
      if (matchedModel) {
        inputsText = matchedModel.features
          .map((feat) => `${feat.name}: ${pred.inputs[feat.id] ?? feat.defaultValue}`)
          .join(" | ");
      } else {
        inputsText = JSON.stringify(pred.inputs).replace(/"/g, "");
      }

      const formattedRow = [
        pred.timestamp,
        pred.modelName,
        `"${inputsText}"`,
        pred.result,
        pred.targetName,
        pred.targetUnit,
      ];
      csvRows.push(formattedRow.join(","));
    });

    const csvBlob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(csvBlob);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", url);
    downloadAnchor.setAttribute("download", `regression_prediction_logs_${Date.now()}.csv`);
    downloadAnchor.style.visibility = "hidden";
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const filteredPredictions = predictions.filter((pred) => {
    const matchesModel = modelFilter === "all" || pred.modelId === modelFilter;
    const matchesSearch =
      pred.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pred.targetName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModel && matchesSearch;
  });

  return (
    <div className="space-y-8 text-left max-w-5xl mx-auto">
      {/* Upper header action row only if we have logs */}
      {predictions.length > 0 && (
        <div className="flex justify-end">
          <div className="flex gap-2.5 shrink-0">
            <button
              onClick={handleCreateCSVAndDownload}
              className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition select-none cursor-pointer shadow-xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" /> Export as CSV
            </button>
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to purge all saved historical prediction logs? This is irreversible.")) {
                  onClearAllPredictions();
                }
              }}
              className="px-4 py-2 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-100 text-rose-600 hover:text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition select-none cursor-pointer shadow-xs"
            >
              <Trash2 className="h-3.5 w-3.5" /> Wipe Logs
            </button>
          </div>
        </div>
      )}

      {predictions.length > 0 ? (
        <div className="space-y-4">
          {/* Query Filters layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-slate-200 p-4 rounded-2xl shadow-xs">
            {/* Search Input bar */}
            <div className="sm:col-span-2 relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="h-4.5 w-4.5" />
              </span>
              <input
                type="text"
                placeholder="Search by model or output target..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white text-xs text-slate-800 placeholder-slate-400 rounded-xl pl-11 pr-4 py-3 outline-hidden transition font-medium"
              />
            </div>

            {/* Selector Dropdown tag */}
            <div>
              <select
                value={modelFilter}
                onChange={(e) => setModelFilter(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-slate-400 focus:bg-white text-xs text-slate-700 rounded-xl px-4 py-3 outline-hidden cursor-pointer h-full font-semibold"
              >
                <option value="all">Filter: All Models</option>
                {models.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Table Container Code block */}
          {filteredPredictions.length > 0 ? (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full text-xs text-left" role="grid">
                <thead className="bg-slate-100 text-[10px] font-extrabold tracking-widest uppercase text-slate-500 border-b border-slate-200">
                  <tr role="row">
                    <th className="py-3 px-5">Timestamp</th>
                    <th className="py-3 px-4">Predictive Model</th>
                    <th className="py-3 px-4">Input Parameter Configuration</th>
                    <th className="py-3 px-4 text-blue-600">Result Output</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPredictions.map((pred) => {
                    const matchedModel = models.find((m) => m.id === pred.modelId);
                    return (
                      <tr key={pred.id} className="hover:bg-slate-50/70 transition-colors" role="row">
                        {/* Timestamp columns */}
                        <td className="py-3.5 px-5 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                          {pred.timestamp}
                        </td>

                        {/* Model Names column */}
                        <td className="py-3.5 px-4">
                          <span className="font-bold text-slate-800 block">{pred.modelName}</span>
                          <span className="text-[10px] text-slate-450 font-medium font-sans mt-0.5 block">{pred.targetName} prediction</span>
                        </td>

                        {/* Input configurations matrix list */}
                        <td className="py-3.5 px-4 max-w-sm">
                          <div className="flex flex-wrap gap-x-2 gap-y-1.5 font-mono text-[10px] text-slate-600 leading-normal">
                            {matchedModel ? (
                              matchedModel.features.map((feat) => {
                                const activeVal = pred.inputs[feat.id] ?? feat.defaultValue;
                                return (
                                  <span key={feat.id} className="bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-md shrink-0 whitespace-nowrap">
                                    <span className="text-slate-400">{feat.name}:</span>{" "}
                                    <strong className="text-blue-600 font-extrabold">{activeVal}</strong>{" "}
                                    <span className="text-slate-400 text-[9px] font-sans">{feat.unit}</span>
                                  </span>
                                );
                              })
                            ) : (
                              Object.entries(pred.inputs).map(([key, value]) => (
                                <span key={key} className="bg-slate-50 border px-2 py-0.5 rounded shrink-0">
                                  {key}: <strong className="text-slate-700">{value}</strong>
                                </span>
                              ))
                            )}
                          </div>
                        </td>

                        {/* Final Result column */}
                        <td className="py-3.5 px-4 whitespace-nowrap font-mono text-xs leading-none">
                          <div className="py-1.5 px-2.5 bg-blue-50 border border-blue-100/50 text-blue-700 rounded font-bold inline-block">
                            {pred.result} <span className="text-[9px] text-slate-400 font-semibold">{pred.targetUnit}</span>
                          </div>
                        </td>

                        {/* Actions delete triggers */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => onDeletePrediction(pred.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-500 transition"
                            title="Delete record from workspace"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
              <AlertCircle className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-600">No Matching Prediction Logs</p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">Adjust your filter tags or query terms to match saved records.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-14 text-center border-dashed">
          <History className="h-12 w-12 text-slate-350 mx-auto mb-3 animate-pulse" />
          <h2 className="text-base font-bold text-slate-805">Empty Predictions Register</h2>
          <p className="text-xs text-slate-450 mt-1.5 max-w-sm mx-auto leading-relaxed">
            You haven't generated or saved any prediction calculations. Head over to the predictor run workspace to run and save your evaluation queries.
          </p>

          <button
            onClick={() => onNavigateTab("predict")}
            className="mt-6 px-5 py-3.5 bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 transition active:scale-[0.98] cursor-pointer"
          >
            <Calculator className="h-4 w-4 text-slate-400" /> Run Prediction Workbench <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
