import time
from locust import HttpUser, task, between

class QuickstartUser(HttpUser):
    host = 'http://albedo'
    wait_time = between(1, 2.5)

    @task
    def static_files(self):
        self.client.get("/index.html")

    @task
    def api_events(self):
        self.client.get("/api/events?from=2021-06-05&to=2021-06-07&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00&rtsSunEnabled=false&rtsMoonEnabled=true&conjunctionsSunEnabled=true&conjunctionsMoonEnabled=true&conjunctionsPlanetsEnabled=true&conjunctionsCometsEnabled=true&conjunctionsAsteroidsEnabled=true&conjunctionsCataloguesDSEnabled=true&cFilterBlindedBySun=true", name="/api/events")
        self.client.get("/api/events/riseTransitSet?bodies=Sun,Mercury,Venus,Mars,Jupiter,Saturn,Neptune,Uranus&from=2021-06-04&to=2021-06-05&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00", name="/api/events/riseTransitSet")

    @task
    def api_tools(self):
        self.client.get("/api/ephemerides?body=Venus&from=2021-06-01&to=2021-07-01&interval=1.0&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00", name="/api/ephemerides")
        self.client.get("/api/conjunctions?primaryBodies=Sun,Moon&primary=Planet&secondary=Comet,Asteroid&catalogues=Messier,NGC&from=2021-06-04&to=2021-06-11&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00", name="/api/conjunctions")
        self.client.get("/api/separation?firstBody=Sun&secondBody=Moon&from=2021-06-04&to=2021-07-04&interval=1.0&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00", name="/api/separation")
        self.client.get("/api/comets/bright?date=2021-06-04&magnitudeLimit=10&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00", name="/api/comets/bright")

    @task
    def api_charts(self):
        self.client.get("/api/altitude?bodies=Sun,Moon,Mercury,Venus,Mars,Jupiter,Saturn,Neptune,Uranus&date=2021-06-04&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00", name="/api/altitude")
        self.client.get("/api/charts/visibility?bodies=Mercury,Venus,Mars,Jupiter,Saturn,Neptune,Uranus&from=2021-01-01&to=2021-12-31&interval=1.0&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00", name="/api/charts/visibility")
        self.client.get("/api/series/transit?bodies=Mars,Jupiter,Saturn,Neptune,Uranus&from=2021-01-01&to=2021-12-31&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00", name="/api/series/transit")

    @task
    def api_catalogues(self):
        self.client.get("/api/catalogue?catalogueName=NGC&nameFilter=760&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00", name="/api/catalogue?catalogueName=NGC")
        self.client.get("/api/catalogue/comets?nameFilter=ATLAS&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00", name="/api/catalogue/comets")
