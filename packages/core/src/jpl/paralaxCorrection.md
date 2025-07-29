Excellent question. This is a classic and fundamental task in observational astronomy, and SPICE is perfectly designed to handle it. The process involves calculating two state vectors in a common inertial reference frame and then subtracting them.

The core concept is to move from a geocentric (Earth-centered) perspective to a topocentric (surface-location-centered) perspective.

Here is the detailed technical procedure.

The Core Principle: Vector Arithmetic

The state (position and velocity) of an object relative to your location on the surface is derived from a simple vector equation:

State_of_Planet_rel_to_Observer = State_of_Planet_rel_to_Earth_Center - State_of_Observer_rel_to_Earth_Center

To perform this subtraction, all three state vectors must be expressed at the same epoch (time) and in the same reference frame (e.g., J2000).

Required SPICE Kernels

You will need the standard set of kernels, plus a high-precision PCK for Earth:

SPK (Spacecraft and Planet Kernel): A planetary ephemeris file (e.g., de440.bsp) to get the positions of the planets and Earth relative to the Solar System Barycenter.
PCK (Planetary Constants Kernel): A text PCK containing data on Earth's size, shape (flattening), and orientation. A high-precision PCK is recommended for accurate surface calculations.
LSK (Leapseconds Kernel): To handle time conversions between UTC and Ephemeris Time (ET).
FK (Frames Kernel): A frames kernel for Earth (earth_latest_high_prec.tf) to define the relationship between the body-fixed frame (IAU_EARTH) and inertial frames like J2000.
Step-by-Step Procedure

Here is the computational sequence to get the apparent state of a planet for a topocentric observer.

Step 1: Load Kernels

As always, begin by loading all necessary kernels into the SPICE pool using furnsh_c (or your language's equivalent).

Step 2: Convert Observation Time to Ephemeris Time (ET)

Your observation time (likely in UTC) must be converted to ET, the uniform time scale used for all SPICE ephemeris computations.

Routine: str2et_c or utc2et_c
Step 3: Calculate the Observer's Position Vector in the Earth-Fixed Frame

You have the observer's geodetic coordinates (latitude, longitude, altitude). You need to convert these into a Cartesian (X, Y, Z) position vector in the Earth's body-fixed reference frame, IAU_EARTH.

Get Earth's Radii: First, retrieve the Earth's equatorial radius and flattening factor from the loaded PCK.
Routine: bodvrd_c (e.g., bodvrd_c("EARTH", "RADII", 3, &dim, radii);)
Convert Geodetic to Rectangular: Use the geodetic coordinates and the Earth's radii to compute the Cartesian vector. Remember to convert latitude and longitude from degrees to radians first.
Routine: georec_c
Inputs: longitude (rad), latitude (rad), altitude (km), equatorial radius (km), flattening factor.
Output: A 3-element position vector pos_obs_IAU in the IAU_EARTH frame.
Step 4: Transform the Observer's State into an Inertial Frame

The vector from Step 3 is in the IAU_EARTH frame, which co-rotates with the Earth. To perform vector math with celestial bodies, you must express this vector in an inertial frame like J2000.

The observer is "fixed" on the rotating Earth, so their position vector is constant in the IAU_EARTH frame, meaning their velocity in that frame is (0, 0, 0). We need to transform this full state (position and velocity) into the J2000 frame.

Routine: sxform_c (State Transform)
Inputs: from frame ("IAU_EARTH"), to frame ("J2000"), epoch (et), and the observer's state vector in the IAU_EARTH frame (the position from georec_c and a zero velocity vector).
Output: The observer's state vector state_obs_J2000 relative to the Earth's center, but now expressed in the J2000 frame. This vector will have a non-zero velocity due to the Earth's rotation.
Step 5: Compute the Geocentric State of the Target Planet

This is the standard SPICE call to get the state of the planet relative to the Earth's center, including corrections for light travel time and stellar aberration.

Routine: spkezr_c
Inputs: targ (e.g., "MARS"), et, ref ("J2000"), abcorr ("LT+S"), obs ("EARTH").
Output: The state vector state_planet_J2000 of the planet relative to the Earth's center, in the J2000 frame.
Step 6: Compute the Final Topocentric State Vector

Now that you have both state vectors in the same frame (J2000) and relative to the same origin (Earth's center), you can perform the vector subtraction from the core principle.

Routine: vsub_c (Vector Subtraction)
Inputs: state_planet_J2000 and state_obs_J2000.
Output: The final state vector state_final_topo of the planet relative to your surface location. This vector gives you the topocentric position (and velocity) you need for your ephemeris.
Pseudocode Example
// Assume kernels are loaded and time is converted to 'et'

// Observer's geodetic coordinates (in radians and km)
long_rad = longitude_deg * RPD_C();
lat_rad  = latitude_deg  * RPD_C();
alt_km   = altitude_km;

// Step 3: Get observer's position in IAU_EARTH frame
bodvrd_c("EARTH", "RADII", 3, &dim, radii);
re = radii[0];
f  = (radii[0] - radii[2]) / radii[0];
georec_c(long_rad, lat_rad, alt_km, re, f, pos_obs_IAU);

// Step 4: Transform observer's state to J2000 frame
SpiceDouble state_obs_IAU[6] = {pos_obs_IAU[0], pos_obs_IAU[1], pos_obs_IAU[2], 0.0, 0.0, 0.0};
sxform_c("IAU_EARTH", "J2000", et, state_obs_IAU, state_obs_J2000);

// Step 5: Get geocentric state of the planet
spkezr_c("MARS", et, "J2000", "LT+S", "EARTH", state_planet_J2000, &lt);

// Step 6: Compute final topocentric state
vsub_c(state_planet_J2000, state_obs_J2000, state_final_topo);

// 'state_final_topo' now holds the apparent position and velocity of Mars
// as seen by the observer on the surface of the Earth.
// You can convert the position vector to RA/Dec using recrad_c.
