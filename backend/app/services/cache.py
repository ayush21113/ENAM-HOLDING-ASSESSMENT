"""
High-Speed In-Memory & Disk Cache for FINN
Reduces redundant API calls to Yahoo Finance and LLMs.
"""
import time
import json
import os
from typing import Any, Optional

class SimpleCache:
    def __init__(self, ttl_seconds: int = 300, disk_cache_dir: str = ".cache"):
        self.ttl = ttl_seconds
        self.memory_store = {}
        self.disk_cache_dir = disk_cache_dir
        os.makedirs(disk_cache_dir, exist_ok=True)

    def get(self, key: str) -> Optional[Any]:
        # Check memory first
        if key in self.memory_store:
            data, expire_time = self.memory_store[key]
            if time.time() < expire_time:
                return data
            else:
                del self.memory_store[key]

        # Check disk fallback
        disk_path = os.path.join(self.disk_cache_dir, f"{key}.json")
        if os.path.exists(disk_path):
            try:
                with open(disk_path, "r", encoding="utf-8") as f:
                    entry = json.load(f)
                    if time.time() < entry.get("expires_at", 0):
                        self.memory_store[key] = (entry["data"], entry["expires_at"])
                        return entry["data"]
            except Exception:
                pass
        return None

    def set(self, key: str, value: Any, custom_ttl: Optional[int] = None):
        expiry = time.time() + (custom_ttl if custom_ttl is not None else self.ttl)
        self.memory_store[key] = (value, expiry)
        
        # Save to disk
        disk_path = os.path.join(self.disk_cache_dir, f"{key}.json")
        try:
            with open(disk_path, "w", encoding="utf-8") as f:
                json.dump({"data": value, "expires_at": expiry}, f)
        except Exception:
            pass

cache = SimpleCache(ttl_seconds=600)  # 10 minutes cache
