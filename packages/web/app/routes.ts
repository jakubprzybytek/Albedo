import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route('profile', 'routes/profile.tsx'),
  route('states', 'routes/states.tsx'),
  route('ephemeris', 'routes/ephemeris.tsx'),
  route('altitudes', 'routes/altitudes.tsx'),
  route('separations', 'routes/separations.tsx'),
  route('conjunctions', 'routes/conjunctions.tsx'),
  route('dso-conjunctions', 'routes/dso-conjunctions.tsx'),
  route('eclipses', 'routes/eclipses.tsx'),
] satisfies RouteConfig;
