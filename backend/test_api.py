import unittest
from fastapi.testclient import TestClient
from main import app

class TestAPI(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)

    def test_health_check(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "service": "ApexMetrics Backend"})

    def test_get_sessions(self):
        response = self.client.get("/api/sessions/")
        self.assertEqual(response.status_code, 200)
        self.assertIsInstance(response.json(), list)

    def test_get_telemetry_invalid_lap_id(self):
        response = self.client.get("/api/laps/invalid_lap_id/telemetry")
        self.assertEqual(response.status_code, 400)
        self.assertIn("Invalid lap_id format", response.json()["detail"])

if __name__ == "__main__":
    unittest.main()
