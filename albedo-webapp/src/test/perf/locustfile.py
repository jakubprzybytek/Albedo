import time
from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    host = 'http://localhost:8089'
    wait_time = between(1, 2.5)

    @task
    def hello_world(self):
        self.client.get("/api/ephemerides?body=Venus&from=2021-06-03&to=2021-07-03&interval=1.0&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")

#    def on_start(self):
#        self.client.post("/login", json={"username":"foo", "password":"bar"})