/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { RegressionModel, TrainingDataPoint, ModelFeature } from "../types";

// Matrix operations for Ordinary Least Squares (OLS) / Ridge Regression
export class MatrixSolver {
  // Transpose a 2D matrix
  static transpose(X: number[][]): number[][] {
    const rows = X.length;
    const cols = X[0].length;
    const res: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        res[c][r] = X[r][c];
      }
    }
    return res;
  }

  // Multiply two 2D matrices or matrix and vector
  static multiply(A: number[][], B: number[][]): number[][] {
    const rA = A.length;
    const cA = A[0].length;
    const rB = B.length;
    const cB = B[0].length;

    if (cA !== rB) {
      throw new Error(`Matrix multiplication dimensions mismatch: ${cA} !== ${rB}`);
    }

    const res: number[][] = Array.from({ length: rA }, () => Array(cB).fill(0));
    for (let i = 0; i < rA; i++) {
      for (let j = 0; j < cB; j++) {
        let sum = 0;
        for (let k = 0; k < cA; k++) {
          sum += A[i][k] * B[k][j];
        }
        res[i][j] = sum;
      }
    }
    return res;
  }

  // Invert a square matrix using Gauss-Jordan elimination with partial pivoting
  // Includes a small ridge term to prevent singular division
  static invert(A: number[][], l2Reg: number = 1e-5): number[][] {
    const n = A.length;
    // Create augmented matrix [A | I] and add L2 regularization to diagonal
    const M: number[][] = Array.from({ length: n }, () => Array(2 * n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        M[i][j] = A[i][j] + (i === j ? l2Reg : 0);
      }
      M[i][n + i] = 1; // Identity matrix
    }

    // Gauss-Jordan
    for (let i = 0; i < n; i++) {
      // Pivot selection
      let maxEl = Math.abs(M[i][i]);
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(M[k][i]) > maxEl) {
          maxEl = Math.abs(M[k][i]);
          maxRow = k;
        }
      }

      // Swap maximum row with current row
      if (maxRow !== i) {
        const temp = M[i];
        M[i] = M[maxRow];
        M[maxRow] = temp;
      }

      const diag = M[i][i];
      if (Math.abs(diag) < 1e-12) {
        throw new Error("Collinear or singular matrix error: The features are highly correlated or insufficient.");
      }

      // Scale current row to make leading element 1
      for (let j = i; j < 2 * n; j++) {
        M[i][j] /= diag;
      }

      // Eliminate elements above and below current position
      for (let k = 0; k < n; k++) {
        if (k !== i) {
          const factor = M[k][i];
          for (let j = i; j < 2 * n; j++) {
            M[k][j] -= factor * M[i][j];
          }
        }
      }
    }

    // Extract inverted matrix
    const inv: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        inv[i][j] = M[i][n + j];
      }
    }
    return inv;
  }
}

// Solves Multiple Linear Regression
// Fits target Y from features matrix X using: Beta = (XT X)^-1 XT Y
export function trainMultipleLinearRegression(
  dataset: TrainingDataPoint[],
  featureCount: number
): { weights: number[]; intercept: number; r2: number; mse: number } {
  if (dataset.length <= featureCount) {
    throw new Error(`Insufficient data. You need at least ${featureCount + 1} observations to solve for ${featureCount} features.`);
  }

  // 1. Prepare X matrix and Y vector
  // Append 1 to each X row to capture intercept bias
  const N = dataset.length;
  const X_augmented: number[][] = [];
  const Y_vector: number[][] = [];

  for (let i = 0; i < N; i++) {
    const row = [...dataset[i].X, 1]; // [feat1, feat2, ..., 1]
    X_augmented.push(row);
    Y_vector.push([dataset[i].Y]);
  }

  // 2. Compute Xt
  const Xt = MatrixSolver.transpose(X_augmented);

  // 3. Compute XtX
  const XtX = MatrixSolver.multiply(Xt, X_augmented);

  // 4. Invert XtX
  const XtX_inv = MatrixSolver.invert(XtX);

  // 5. Compute XtY
  const XtY = MatrixSolver.multiply(Xt, Y_vector);

  // 6. Compute Beta = XtX_inv * XtY
  const Beta = MatrixSolver.multiply(XtX_inv, XtY);

  // Save weights and intercept
  const weights: number[] = [];
  for (let idx = 0; idx < featureCount; idx++) {
    weights.push(Beta[idx][0]);
  }
  const intercept = Beta[featureCount][0];

  // Calculate stats (R2 & MSE)
  let sumSquaredResiduals = 0;
  let sumY = 0;
  for (let i = 0; i < N; i++) {
    sumY += dataset[i].Y;
  }
  const meanY = sumY / N;

  let totalSumSquares = 0;
  for (let i = 0; i < N; i++) {
    // Predicted Y
    let predY = intercept;
    for (let idx = 0; idx < featureCount; idx++) {
      predY += dataset[i].X[idx] * weights[idx];
    }
    sumSquaredResiduals += Math.pow(dataset[i].Y - predY, 2);
    totalSumSquares += Math.pow(dataset[i].Y - meanY, 2);
  }

  const mse = sumSquaredResiduals / N;
  const r2 = totalSumSquares === 0 ? 0 : 1 - sumSquaredResiduals / totalSumSquares;

  return {
    weights,
    intercept,
    r2: Math.max(0, Math.min(1, r2)), // clamp R2 between 0 and 1
    mse,
  };
}

// Pre-defined application regression models
export const STATIC_MODELS: RegressionModel[] = [
  {
    id: "advertising-sales",
    name: "Advertising Sales Predictor",
    description: "Predicts product sales based on advertising budgets allocated to TV, Radio, and Newspaper channels, factoring in non-linear diminishing returns.",
    targetName: "Expected Sales",
    targetUnit: "Units",
    intercept: 5.1509,
    r2Score: 0.95,
    isPolynomial: true,
    polyCoefficients: [
      0.07621649, -0.03198383, -0.00192025, 
      -0.00010581, 0.00041854, -0.00002554, 
      0.00144820, 0.00016469, 0.000000085
    ],
    features: [
      {
        id: "tv",
        name: "TV Budget",
        min: 0,
        max: 500,
        step: 1,
        defaultValue: 150,
        unit: "$1k",
        coefficient: 0, // Ignored in poly calc
      },
      {
        id: "radio",
        name: "Radio Budget",
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 25,
        unit: "$1k",
        coefficient: 0,
      },
      {
        id: "newspaper",
        name: "Newspaper Budget",
        min: 0,
        max: 150,
        step: 1,
        defaultValue: 30,
        unit: "$1k",
        coefficient: 0,
      },
    ],
  },
  {
    id: "house-prices",
    name: "Real Estate Value Predictor",
    description: "Evaluates standard urban and suburban properties based on size, bedrooms, age, and commuter distances to compute estimated sales values.",
    targetName: "Market Value",
    targetUnit: "$1,000s",
    intercept: 85.0,
    r2Score: 0.94,
    features: [
      {
        id: "sqft",
        name: "Home Area",
        min: 500,
        max: 5000,
        step: 50,
        defaultValue: 1800,
        unit: "sqft",
        coefficient: 0.15, // $150 per sqft
      },
      {
        id: "bedrooms",
        name: "Bedrooms",
        min: 1,
        max: 6,
        step: 1,
        defaultValue: 3,
        unit: "rooms",
        coefficient: 12.5, // $12,500 per room
      },
      {
        id: "age",
        name: "Property Age",
        min: 0,
        max: 80,
        step: 1,
        defaultValue: 15,
        unit: "years",
        coefficient: -1.2, // -$1,200 depreciation per age-year
      },
      {
        id: "distance",
        name: "City Distance",
        min: 1,
        max: 30,
        step: 0.5,
        defaultValue: 8,
        unit: "miles",
        coefficient: -4.8, // -$4,800 penalty per mile away
      },
    ],
  },
  {
    id: "student-grades",
    name: "Academic Performance Forecaster",
    description: "Determines final examination marks using inputs showing learning engagement, physical balance, and attendance consistency.",
    targetName: "Expected Exam Score",
    targetUnit: "pts",
    intercept: 10.0,
    r2Score: 0.89,
    features: [
      {
        id: "study",
        name: "Weekly Study Time",
        min: 0,
        max: 40,
        step: 1,
        defaultValue: 12,
        unit: "hours",
        coefficient: 1.4, // +1.4 points per study-hour
      },
      {
        id: "sleep",
        name: "Sleep Duration",
        min: 4,
        max: 10,
        step: 0.5,
        defaultValue: 7.5,
        unit: "hours",
        coefficient: 2.8, // +2.8 points per sleep-hour
      },
      {
        id: "tests",
        name: "Practice Exams Done",
        min: 0,
        max: 10,
        step: 1,
        defaultValue: 3,
        unit: "exams",
        coefficient: 1.5, // +1.5 points per mock test
      },
      {
        id: "attendance",
        name: "Class Attendance",
        min: 50,
        max: 100,
        step: 1,
        defaultValue: 90,
        unit: "%",
        coefficient: 0.4, // +0.4 points per attendance-percent
      },
    ],
  },
  {
    id: "fitness-index",
    name: "Physical Fitness Scorecard",
    description: "Computes a normalized health and cardio fitness index score (0-100) combining lifestyle, diet, sleep, and negative stressors.",
    targetName: "Fitness Index Rating",
    targetUnit: "/100",
    intercept: 60.0,
    r2Score: 0.91,
    features: [
      {
        id: "exercise",
        name: "Active Exercise",
        min: 0,
        max: 20,
        step: 0.5,
        defaultValue: 4,
        unit: "hrs/wk",
        coefficient: 2.5, // +2.5 pts per workout hr
      },
      {
        id: "water",
        name: "Hydration Intake",
        min: 1,
        max: 5,
        step: 0.1,
        defaultValue: 2.5,
        unit: "liters",
        coefficient: 3.2, // +3.2 pts per L of water
      },
      {
        id: "sleep",
        name: "Rest Quality",
        min: 4,
        max: 10,
        step: 0.5,
        defaultValue: 7.5,
        unit: "hrs/night",
        coefficient: 1.8, // +1.8 pts per resting hour
      },
      {
        id: "stress",
        name: "Stress Load",
        min: 1,
        max: 10,
        step: 1,
        defaultValue: 4,
        unit: "/10 score",
        coefficient: -2.1, // -2.1 stress penalty factor
      },
    ],
  },
];

// Evaluate the model prediction
export function computePrediction(model: RegressionModel, inputs: Record<string, number>): number {
  let output = model.intercept;

  if (model.isPolynomial && model.polyCoefficients && model.id === "advertising-sales") {
    const tv = inputs['tv'] ?? model.features.find(f => f.id === 'tv')?.defaultValue ?? 0;
    const radio = inputs['radio'] ?? model.features.find(f => f.id === 'radio')?.defaultValue ?? 0;
    const news = inputs['newspaper'] ?? model.features.find(f => f.id === 'newspaper')?.defaultValue ?? 0;
    const coef = model.polyCoefficients;
    
    // Poly features order: TV, Radio, Newspaper, TV^2, TV*Radio, TV*News, Radio^2, Radio*News, News^2
    output = model.intercept + 
             coef[0] * tv + coef[1] * radio + coef[2] * news +
             coef[3] * (tv * tv) + coef[4] * (tv * radio) + coef[5] * (tv * news) +
             coef[6] * (radio * radio) + coef[7] * (radio * news) + coef[8] * (news * news);
  } else {
    model.features.forEach((feat) => {
      const val = inputs[feat.id] ?? feat.defaultValue;
      output += val * feat.coefficient;
    });
  }

  // Handle constraints for score outputs
  if (model.id === "student-grades" || model.id === "fitness-index") {
    output = Math.max(0, Math.min(100, output));
  } else if (model.id === "house-prices" || model.id === "advertising-sales") {
    output = Math.max(0, output);
  }

  return Number(output.toFixed(2));
}

// Generate realistic mock sample data for pre-trained models or for user tests
export function generateMockDataset(
  features: { id: string; min: number; max: number; coefficient: number }[],
  intercept: number,
  size: number = 10
): TrainingDataPoint[] {
  const dataset: TrainingDataPoint[] = [];

  for (let i = 0; i < size; i++) {
    const X: number[] = [];
    let noise = (Math.random() - 0.5) * 15; // random residual error
    let Y = intercept + noise;

    features.forEach((feat, idx) => {
      // Random feature value inside its range
      const range = feat.max - feat.min;
      const rawVal = feat.min + Math.random() * range;
      const stepScaled = Math.round(rawVal / 1) * 1; // round
      const finalVal = Math.max(feat.min, Math.min(feat.max, stepScaled));

      X.push(finalVal);
      Y += finalVal * feat.coefficient;
    });

    dataset.push({
      id: `dp-${i}-${Date.now()}`,
      X,
      Y: Number(Y.toFixed(2)),
    });
  }

  return dataset;
}
