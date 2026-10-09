"""
train_model.py  –  GSTGuard Prototype Model Training
=====================================================

Trains an Isolation Forest anomaly-detection model on **synthetic** GST
invoice transaction data and saves the fitted model + scaler to disk.

IMPORTANT DISCLAIMER
--------------------
This is a prototype for demonstration purposes only.
- The training data is synthetic and does not represent real-world GST
  transactions.
- The model has NOT been validated on real data and should NOT be used to
  make definitive fraud determinations.
- Any prediction should be treated as a preliminary flag that warrants
  further human review.

Features used (all numeric):
  1. invoice_amount      – Total invoice value (₹)
  2. gst_amount          – GST component (₹)
  3. item_count          – Number of line-items / quantity
  4. hist_avg_amount     – Historical average invoice amount for this vendor
  5. amount_to_hist_ratio – invoice_amount / hist_avg_amount

Usage:
    python train_model.py
"""

import os
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler
import joblib

# ---------------------------------------------------------------------------
# 1.  Generate synthetic training data
# ---------------------------------------------------------------------------

def generate_synthetic_data(n_normal=500, n_anomalous=30, seed=42):
    """
    Create a synthetic dataset of GST invoice transactions.

    Normal transactions are sampled from distributions that mimic typical
    small-to-medium business invoicing patterns.  A small number of
    anomalous records are injected with deliberately extreme values to
    give the Isolation Forest clear outlier examples during training.

    Returns
    -------
    pd.DataFrame
        DataFrame with columns:
        invoice_amount, gst_amount, item_count,
        hist_avg_amount, amount_to_hist_ratio
    """
    rng = np.random.default_rng(seed)

    # --- Normal transactions ---
    invoice_amount_normal = rng.lognormal(mean=10.5, sigma=0.8, size=n_normal)
    # Typical amounts range roughly ₹5,000 – ₹3,00,000
    invoice_amount_normal = np.clip(invoice_amount_normal, 1000, 500000)

    gst_rates = np.array([0.05, 0.12, 0.18, 0.28])
    chosen_rates_normal = rng.choice(gst_rates, size=n_normal)
    gst_amount_normal = invoice_amount_normal * chosen_rates_normal

    item_count_normal = rng.integers(1, 60, size=n_normal).astype(float)

    # Historical average is close to the invoice amount for normal txns
    hist_avg_normal = invoice_amount_normal * rng.uniform(0.7, 1.3, size=n_normal)

    ratio_normal = invoice_amount_normal / hist_avg_normal

    # --- Anomalous transactions ---
    # Much higher amounts, unusual GST, unusual ratios
    invoice_amount_anom = rng.lognormal(mean=13.0, sigma=0.6, size=n_anomalous)
    invoice_amount_anom = np.clip(invoice_amount_anom, 300000, 5000000)

    chosen_rates_anom = rng.choice(gst_rates, size=n_anomalous)
    gst_amount_anom = invoice_amount_anom * chosen_rates_anom

    # Either very high or very low item counts
    item_count_anom = rng.choice(
        np.concatenate([
            rng.integers(1, 3, size=n_anomalous // 2),
            rng.integers(150, 500, size=n_anomalous - n_anomalous // 2),
        ]),
        size=n_anomalous,
        replace=False,
    ).astype(float)

    # Historical average much lower → high ratio
    hist_avg_anom = invoice_amount_anom * rng.uniform(0.15, 0.4, size=n_anomalous)
    ratio_anom = invoice_amount_anom / hist_avg_anom

    # --- Combine ---
    df = pd.DataFrame({
        "invoice_amount": np.concatenate([invoice_amount_normal, invoice_amount_anom]),
        "gst_amount": np.concatenate([gst_amount_normal, gst_amount_anom]),
        "item_count": np.concatenate([item_count_normal, item_count_anom]),
        "hist_avg_amount": np.concatenate([hist_avg_normal, hist_avg_anom]),
        "amount_to_hist_ratio": np.concatenate([ratio_normal, ratio_anom]),
    })

    return df


# ---------------------------------------------------------------------------
# 2.  Train and persist the model
# ---------------------------------------------------------------------------

def train_and_save(output_dir="models"):
    """Train Isolation Forest on synthetic data and save artefacts."""

    os.makedirs(output_dir, exist_ok=True)

    print("Generating synthetic GST transaction data ...")
    df = generate_synthetic_data()
    print(f"  Dataset shape: {df.shape}")
    print(f"  Feature columns: {list(df.columns)}")
    print(f"\n  Sample statistics:\n{df.describe().round(2)}\n")

    # Scale features so the Isolation Forest treats all dimensions equally
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(df)

    print("Training Isolation Forest ...")
    model = IsolationForest(
        n_estimators=200,
        contamination=0.06,        # ~6 % of training data treated as outliers
        max_samples="auto",
        random_state=42,
        n_jobs=-1,
    )
    model.fit(X_scaled)

    # Quick sanity check on training data
    preds = model.predict(X_scaled)
    n_outliers = (preds == -1).sum()
    print(f"  Training outliers detected: {n_outliers}/{len(df)}")

    # Persist
    model_path = os.path.join(output_dir, "isolation_forest.joblib")
    scaler_path = os.path.join(output_dir, "scaler.joblib")
    joblib.dump(model, model_path)
    joblib.dump(scaler, scaler_path)
    print(f"\n[OK] Model saved  -> {model_path}")
    print(f"[OK] Scaler saved -> {scaler_path}")


if __name__ == "__main__":
    train_and_save()
