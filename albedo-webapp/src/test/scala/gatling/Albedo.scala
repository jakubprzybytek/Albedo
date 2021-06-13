/*
 * Copyright 2011-2021 GatlingCorp (https://gatling.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package gatling

import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._

class Albedo extends Simulation {

  val httpProtocol = http
    // Here is the root for all relative URLs
    .baseUrl("http://54.77.248.5")
    // Here are the common headers
    .acceptHeader("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8")
    .doNotTrackHeader("1")
    .acceptLanguageHeader("en-US,en;q=0.5")
    .acceptEncodingHeader("gzip, deflate")
    .userAgentHeader("Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:16.0) Gecko/20100101 Firefox/16.0")

  var static = exec(
    http("index.html")
      .get("/index.html")
  )
    .pause(5)

  val events = exec(
      http("/api/events")
        .get("/api/events?from=2021-06-05&to=2021-06-07&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00&rtsSunEnabled=false&rtsMoonEnabled=true&conjunctionsSunEnabled=true&conjunctionsMoonEnabled=true&conjunctionsPlanetsEnabled=true&conjunctionsCometsEnabled=true&conjunctionsAsteroidsEnabled=true&conjunctionsCataloguesDSEnabled=true&cFilterBlindedBySun=true")
    )
      .pause(2)
      .exec(
        http("/api/events/riseTransitSet")
          .get("/api/events/riseTransitSet?bodies=Sun,Mercury,Venus,Mars,Jupiter,Saturn,Neptune,Uranus&from=2021-06-04&to=2021-06-05&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")
      )
      .pause(2)

  // A scenario is a chain of requests and pauses
  val other = exec(
      http("/api/ephemerides")
        .get("/api/ephemerides?body=Venus&from=2021-06-01&to=2021-07-01&interval=1.0&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")
    )
      .pause(2)
      .exec(
        http("/api/conjunctions")
          .get("/api/conjunctions?primaryBodies=Sun,Moon&primary=Planet&secondary=Comet,Asteroid&catalogues=Messier,NGC&from=2021-06-04&to=2021-06-11&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")
      )
      .pause(1)
      .exec(
        http("/api/separation")
          .get("/api/separation?firstBody=Sun&secondBody=Moon&from=2021-06-04&to=2021-07-04&interval=1.0&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")
      )
      .pause(2)
      .exec(
        http("/api/comets/bright")
          .get("/api/comets/bright?date=2021-06-04&magnitudeLimit=10&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")
      )
      .pause(2)
      .exec(
        http("/api/altitude")
          .get("/api/altitude?bodies=Sun,Moon,Mercury,Venus,Mars,Jupiter,Saturn,Neptune,Uranus&date=2021-06-04&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")
      )
      .pause(2)
      .exec(
        http("/api/charts/visibility")
          .get("/api/charts/visibility?bodies=Mercury,Venus,Mars,Jupiter,Saturn,Neptune,Uranus&from=2021-01-01&to=2021-12-31&interval=1.0&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")
      )
      .pause(2)
      .exec(
        http("/api/series/transit")
          .get("/api/series/transit?bodies=Mars,Jupiter,Saturn,Neptune,Uranus&from=2021-01-01&to=2021-12-31&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")
      )
      .pause(2)
      .exec(
        http("/api/catalogue?catalogueName=NGC")
          .get("/api/catalogue?catalogueName=NGC&nameFilter=760&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")
      )
      .pause(2)
      .exec(
        http("/api/catalogue/comets")
          .get("/api/catalogue/comets?nameFilter=ATLAS&longitude=-16.8745&latitude=52.3944028&height=70&timeZone=UTC%2B01:00")
      )

  val scn = scenario("Scenario").during(30 minutes, "ds", true) {
    exec(static, events, other)
  }

  setUp(
    scn.inject(rampUsers(6).during(1.minutes))
  ).protocols(httpProtocol)
}
