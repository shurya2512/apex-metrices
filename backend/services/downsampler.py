import pandas as pd
import numpy as np

class TelemetryDownsampler:
    def __init__(self, interval_ms: int = 250):
        self.interval = f"{interval_ms}ms"

    def process_telemetry(self, raw_data: list[dict]) -> list[dict]:
        """
        Takes raw telemetry data from OpenF1 API and downsamples it into fixed time buckets.
        This reduces the number of data points while maintaining the overall shape of the data.
        """
        if not raw_data:
            return []

        # 1. Load into Pandas DataFrame
        df = pd.DataFrame(raw_data)
        
        # OpenF1 may have columns like: meeting_key, session_key, driver_number, date, rpm, speed, n_gear, throttle, brake, drs
        if "date" not in df.columns:
            return raw_data
            
        # 2. Convert date to datetime objects
        df["date"] = pd.to_datetime(df["date"])
        
        # Sort by date just in case it's out of order
        df = df.sort_values(by="date")
        
        # 3. Create a relative elapsed time index (timedelta)
        start_time = df["date"].iloc[0]
        df["elapsed"] = df["date"] - start_time
        df.set_index("elapsed", inplace=True)
        
        # Columns that make sense to average or forward fill
        numeric_cols = ["rpm", "speed", "n_gear", "throttle", "brake", "drs"]
        # Keep only the columns that actually exist in the payload
        existing_numeric_cols = [col for col in numeric_cols if col in df.columns]
        
        # We need to drop non-numeric columns before resampling
        df_numeric = df[existing_numeric_cols]
        
        # 4. Resample into fixed time buckets (e.g., 250ms) using mean
        # Using mean gives us a smoothed approximation of the values in that window
        df_resampled = df_numeric.resample(self.interval).mean()
        
        # 5. Forward fill missing data
        # If a 250ms bucket had no raw data points, it will be NaN.
        # We forward fill to carry over the last known sensor value.
        df_resampled = df_resampled.ffill()
        
        # Drop any leading NaNs (if the very first bucket somehow had no valid numeric data, though rare)
        df_resampled = df_resampled.dropna()
        
        # Round values for cleanliness
        if "rpm" in df_resampled.columns:
            df_resampled["rpm"] = df_resampled["rpm"].round().astype(int)
        if "speed" in df_resampled.columns:
            df_resampled["speed"] = df_resampled["speed"].round().astype(int)
        if "n_gear" in df_resampled.columns:
            df_resampled["n_gear"] = df_resampled["n_gear"].round().astype(int)
        if "throttle" in df_resampled.columns:
            df_resampled["throttle"] = df_resampled["throttle"].round().astype(int)
        if "brake" in df_resampled.columns:
            df_resampled["brake"] = df_resampled["brake"].round().astype(int)
        if "drs" in df_resampled.columns:
            df_resampled["drs"] = df_resampled["drs"].round().astype(int)
            
        # 6. Prepare output
        # Reset index to make 'elapsed' a column again
        df_resampled.reset_index(inplace=True)
        
        # Convert timedelta back to total seconds for JSON serialization
        df_resampled["elapsed_time"] = df_resampled["elapsed"].dt.total_seconds()
        df_resampled.drop(columns=["elapsed"], inplace=True)
        
        # 7. Convert back to list of dicts
        processed_data = df_resampled.to_dict(orient="records")
        return processed_data

downsampler = TelemetryDownsampler()
