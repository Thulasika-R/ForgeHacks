"""
app.py  –  GSTGuard Flask API
==============================

Provides two endpoints:

  GET  /api/health   → Service health check
  POST /api/analyze  → Analyse a single GST invoice for anomalies

The Isolation Forest model and StandardScaler are loaded at startup from
the ``models/`` directory.  If they are missing the server will refuse to
start – run ``python train_model.py`` first.

IMPORTANT DISCLAIMER
--------------------
This is a **prototype**.  The model was trained on synthetic data and has
NOT been validated against real-world GST transactions.  Predictions
should be interpreted as preliminary indicators that warrant human review,
not as confirmed fraud determinations.
"""

import os
import sys
import traceback

import joblib
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

# ---------------------------------------------------------------------------
# App & CORS setup
# ---------------------------------------------------------------------------

app = Flask(__name__)

# Allow the Vite dev server (default port 5173) and common alternatives
CORS(app, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
])

# ---------------------------------------------------------------------------
# Load model artefacts at startup
# ---------------------------------------------------------------------------

MODEL_DIR = os.path.join(os.path.dirname(__file__), "models")
MODEL_PATH = os.path.join(MODEL_DIR, "isolation_forest.joblib")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.joblib")

if not os.path.isfile(MODEL_PATH) or not os.path.isfile(SCALER_PATH):
    print(
        "\n[ERROR] Model files not found.\n"
        "   Run  `python train_model.py`  first to generate them.\n"
    )
    sys.exit(1)

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
print("[OK] Model and scaler loaded successfully.")

# ---------------------------------------------------------------------------
# Feature names expected by the model (in order)
# ---------------------------------------------------------------------------

FEATURE_NAMES = [
    "invoice_amount",
    "gst_amount",
    "item_count",
    "hist_avg_amount",
    "amount_to_hist_ratio",
]

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

# Lookup table: synthetic historical averages keyed by shop name (lowercase).
# In a production system this would come from a database.
HISTORICAL_AVERAGES = {
    "abc traders": 132000,
    "xyz stores": 87000,
    "ravi enterprises": 148000,
    "kumar supplies": 32000,
    "lakshmi textiles": 110000,
    "patel electronics": 195000,
    "sharma metals": 45000,
    "gupta pharma": 95000,
    "singh hardware": 78000,
}

# Fallback when the shop is unknown
DEFAULT_HIST_AVG = 100000


def _parse_positive_float(value, field_name):
    """Return a positive float or raise ValueError with a human message."""
    if value is None or value == "":
        raise ValueError(f"'{field_name}' is required.")
    try:
        num = float(value)
    except (TypeError, ValueError):
        raise ValueError(f"'{field_name}' must be a valid number.")
    if num < 0:
        raise ValueError(f"'{field_name}' must not be negative.")
    return num


def _build_indicators(risk, ratio, amount, hist_avg):
    """Build the indicators list that the React <RiskResult> component expects."""
    indicators = []

    if risk == "High":
        indicators.append({
            "type": "warning",
            "text": "Transaction value significantly exceeds historical average",
        })
        if ratio > 3.0:
            indicators.append({
                "type": "warning",
                "text": f"Invoice is {ratio:.1f}× the historical average",
            })
        indicators.append({
            "type": "warning",
            "text": "Requires manual verification",
        })
    else:
        indicators.append({
            "type": "success",
            "text": "Invoice value within normal range",
        })
        if ratio <= 1.5:
            indicators.append({
                "type": "success",
                "text": "Transaction pattern appears consistent",
            })
        else:
            indicators.append({
                "type": "warning",
                "text": f"Invoice is {ratio:.1f}× the historical average – monitor closely",
            })

    return indicators


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health():
    """Basic liveness / readiness probe."""
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "disclaimer": (
            "This is a prototype. Predictions are based on synthetic data "
            "and should not be treated as confirmed fraud determinations."
        ),
    })


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Analyse a single GST invoice transaction.

    Expected JSON body (mirrors the React InvoiceForm state):
    {
        "invoiceNumber": "INV-1025",       // optional – echoed back
        "shop":          "ABC Traders",     // optional – used for hist avg lookup
        "gstin":         "33AABCT1234A1ZA", // optional – echoed back
        "amount":        125000,            // REQUIRED – invoice amount (₹)
        "quantity":      10,                // REQUIRED – item count
        "gstRate":       18,                // REQUIRED – GST rate (%)
        "invoiceDate":   "2026-10-09"       // optional – echoed back
    }

    Returns JSON matching the shape expected by <RiskResult>:
    {
        "risk":          "Low" | "High",
        "label":         "LOW ANOMALY RISK" | "HIGH ANOMALY RISK",
        "anomalyScore":  0.18,
        "historicalAvg": 132000,
        "currentAmount": 125000,
        "message":       "...",
        "indicators":    [ { "type": "success"|"warning", "text": "..." }, … ],
        "disclaimer":    "..."
    }
    """
    try:
        data = request.get_json(force=True, silent=True)
        if not data:
            return jsonify({"error": "Request body must be valid JSON."}), 400

        # --- Parse & validate required fields ---
        amount = _parse_positive_float(data.get("amount"), "amount")
        quantity = _parse_positive_float(data.get("quantity"), "quantity")

        gst_rate_raw = data.get("gstRate", data.get("gst_rate"))
        gst_rate = _parse_positive_float(gst_rate_raw, "gstRate")

        # --- Derived features ---
        gst_amount = amount * (gst_rate / 100.0)
        item_count = quantity

        shop_name = str(data.get("shop", "")).strip().lower()
        hist_avg = HISTORICAL_AVERAGES.get(shop_name, DEFAULT_HIST_AVG)

        # Guard against division by zero (shouldn't happen with our data)
        ratio = amount / hist_avg if hist_avg > 0 else 1.0

        # --- Build feature vector (use DataFrame to match training feature names) ---
        import pandas as pd
        features = pd.DataFrame([[
            amount,
            gst_amount,
            item_count,
            hist_avg,
            ratio,
        ]], columns=FEATURE_NAMES)

        features_scaled = scaler.transform(features)

        # --- Model prediction ---
        prediction = model.predict(features_scaled)[0]      # 1 = inlier, -1 = outlier
        raw_score = model.decision_function(features_scaled)[0]

        # Map raw_score to a 0-1 anomaly score.
        # Isolation Forest decision_function: lower → more anomalous.
        # We negate and clip to [0, 1] so higher = more anomalous.
        anomaly_score = float(np.clip(-raw_score, 0.0, 1.0))
        # Normalise into a friendlier 0–1 range
        anomaly_score = round(min(max(anomaly_score, 0.0), 1.0), 2)

        is_anomalous = prediction == -1

        risk = "High" if is_anomalous else "Low"
        label = "HIGH ANOMALY RISK" if is_anomalous else "LOW ANOMALY RISK"

        if is_anomalous:
            message = (
                "Potential anomaly detected. This invoice deviates from "
                "expected patterns and may warrant further verification."
            )
        else:
            message = "Transaction is within the observed historical range."

        indicators = _build_indicators(risk, ratio, amount, hist_avg)

        return jsonify({
            "risk": risk,
            "label": label,
            "anomalyScore": anomaly_score,
            "historicalAvg": round(hist_avg, 2),
            "currentAmount": round(amount, 2),
            "message": message,
            "indicators": indicators,
            "disclaimer": (
                "This is a prototype prediction based on synthetic training "
                "data.  It should not be treated as a confirmed fraud "
                "determination.  Always verify flagged invoices manually."
            ),
        })

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400

    except Exception:
        traceback.print_exc()
        return jsonify({"error": "An internal error occurred during analysis."}), 500


# ---------------------------------------------------------------------------
# Run
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, port=5000)
