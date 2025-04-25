import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route('states', 'routes/states.tsx'),
  route('ephemeris', 'routes/ephemeris.tsx'),
] satisfies RouteConfig;
