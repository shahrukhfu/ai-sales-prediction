/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface ModelFeature {
  id: string;
  name: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
  coefficient: number; // for explanation math
}

export interface RegressionModel {
  id: string;
  name: string;
  description: string;
  features: ModelFeature[];
  intercept: number;
  targetName: string;
  targetUnit: string;
  r2Score: number; // coefficient of determination
  isCustom?: boolean;
  isPolynomial?: boolean;
  polyCoefficients?: number[]; // [w0, w1, w2... etc]
}

export interface PredictionLog {
  id: string;
  userId: string;
  modelId: string;
  modelName: string;
  inputs: Record<string, number>; // featureId -> value
  result: number;
  timestamp: string;
  targetName: string;
  targetUnit: string;
}

export interface TrainingDataPoint {
  id: string;
  X: number[]; // feature values in order
  Y: number;   // target value
}

export interface CustomModelConfig {
  targetName: string;
  targetUnit: string;
  features: { id: string; name: string; unit: string; min: number; max: number }[];
  dataset: TrainingDataPoint[];
}
