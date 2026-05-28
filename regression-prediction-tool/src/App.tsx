/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { User, RegressionModel, PredictionLog } from "./types";
import { STATIC_MODELS } from "./utils/math";

// Custom tab views
import LandingView from "./components/LandingView";
import AuthView from "./components/AuthView";
import Sidebar from "./components/Sidebar";
import DashboardView from "./components/DashboardView";
import PredictorView from "./components/PredictorView";
import TrainingLabView from "./components/TrainingLabView";
import HistoryView from "./components/HistoryView";

import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Authentication status states
  const [user, setUser] = useState<User | null>(null);
  const [authViewMode, setAuthViewMode] = useState<"landing" | "login" | "register">("landing");

  // Models catalog states (Pretrained + Saved user models)
  const [models, setModels] = useState<RegressionModel[]>(STATIC_MODELS);
  const [preSelectedModelId, setPreSelectedModelId] = useState<string | null>(null);

  // Saved prediction registers
  const [predictions, setPredictions] = useState<PredictionLog[]>([]);

  // Navigation state inside dashboard cockpit
  const [activeTab, setActiveTab] = useState("dashboard");

  // Load custom workspace datasets from persistent localStorage on init
  useEffect(() => {
    // 1. Restore User Auth Session
    const savedUser = localStorage.getItem("regression_current_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setAuthViewMode("landing");
    }

    // 2. Load user trained models
    const storedCustomModels = localStorage.getItem("regression_custom_models");
    if (storedCustomModels) {
      const parsed: RegressionModel[] = JSON.parse(storedCustomModels);
      setModels([...STATIC_MODELS, ...parsed]);
    }

    // 3. Load past predictions
    const storedPredictions = localStorage.getItem("regression_predictions");
    if (storedPredictions) {
      setPredictions(JSON.parse(storedPredictions));
    }
  }, []);

  // Update localStorage when predictions change
  const savePredictionsToStorage = (updatedLogs: PredictionLog[]) => {
    setPredictions(updatedLogs);
    localStorage.setItem("regression_predictions", JSON.stringify(updatedLogs));
  };

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setAuthViewMode("landing");
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("regression_current_user");
    setUser(null);
    setAuthViewMode("landing");
    setActiveTab("dashboard");
  };

  const handleAddCustomModel = (newModel: RegressionModel) => {
    const updatedModels = [...models, newModel];
    setModels(updatedModels);

    // Save only custom models into localStorage
    const onlyCustoms = updatedModels.filter((m) => m.isCustom);
    localStorage.setItem("regression_custom_models", JSON.stringify(onlyCustoms));

    // Instantly direct them to Predict view with their new custom model selected!
    setPreSelectedModelId(newModel.id);
    setActiveTab("predict");
  };

  const handleSavePrediction = (logData: Omit<PredictionLog, "id" | "timestamp">) => {
    const now = new Date();
    const ts = now.toISOString().replace("T", " ").slice(0, 19); // YYYY-MM-DD HH:MM:SS format
    const newLog: PredictionLog = {
      ...logData,
      id: `pred-${Date.now()}`,
      timestamp: ts,
    };
    const updated = [newLog, ...predictions];
    savePredictionsToStorage(updated);
  };

  const handleDeletePrediction = (id: string) => {
    const filtered = predictions.filter((p) => p.id !== id);
    savePredictionsToStorage(filtered);
  };

  const handleClearAllPredictions = () => {
    savePredictionsToStorage([]);
  };

  // Nav helper function to connect different views
  const handleNavigateTabWithPayload = (tabId: string, modelId?: string) => {
    if (modelId) {
      setPreSelectedModelId(modelId);
    } else {
      setPreSelectedModelId(null);
    }
    setActiveTab(tabId);
  };

  // Switch router views based on logged states
  if (!user) {
    return (
      <AnimatePresence mode="wait">
        {authViewMode === "landing" ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <LandingView
              onGetStarted={() => setAuthViewMode("register")}
              onLogin={() => setAuthViewMode("login")}
            />
          </motion.div>
        ) : (
          <motion.div
            key="auth"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <AuthView
              initialMode={authViewMode === "register" ? "register" : "login"}
              onAuthSuccess={handleAuthSuccess}
              onBackToHome={() => setAuthViewMode("landing")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Active Authenticated Cockpit Layout with navigation sidebar wrappers
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <DashboardView
            user={user}
            models={models}
            predictions={predictions}
            onNavigateTab={handleNavigateTabWithPayload}
          />
        );
      case "predict":
        return (
          <PredictorView
            userId={user.id}
            models={models}
            onSavePrediction={handleSavePrediction}
            preSelectedModelId={preSelectedModelId}
          />
        );
      case "training":
        return <TrainingLabView onAddCustomModel={handleAddCustomModel} />;
      case "history":
        return (
          <HistoryView
            predictions={predictions}
            models={models}
            onDeletePrediction={handleDeletePrediction}
            onClearAllPredictions={handleClearAllPredictions}
            onNavigateTab={handleNavigateTabWithPayload}
          />
        );
      default:
        return <div className="text-slate-500">View not found.</div>;
    }
  };

  return (
    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} onLogout={handleLogout}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
          className="flex-1"
        >
          {renderActiveTabContent()}
        </motion.div>
      </AnimatePresence>
    </Sidebar>
  );
}
