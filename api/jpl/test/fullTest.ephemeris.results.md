Registering SPK records for 'Sun' w.r.t. 'Solar System Barycenter' for time span between 693230400 and 758203200
Registering SPK records for 'Mercury Barycenter' w.r.t. 'Solar System Barycenter' for time span between 693921600 and 757512000
Registering SPK records for 'Mercury' w.r.t. 'Mercury Barycenter' for time span between -14200747200 and 20514081600
Registering SPK records for 'Earth Moon Barycenter' w.r.t. 'Solar System Barycenter' for time span between 693230400 and 758203200
Registering SPK records for 'Earth' w.r.t. 'Earth Moon Barycenter' for time span between 693921600 and 757512000
Registering SPK records for 'Moon' w.r.t. 'Earth Moon Barycenter' for time span between 693921600 and 757512000
Registering SPK records for 'Venus Barycenter' w.r.t. 'Solar System Barycenter' for time span between 693230400 and 758203200
Registering SPK records for 'Venus' w.r.t. 'Venus Barycenter' for time span between -14200747200 and 20514081600
Registering SPK records for 'Mars Barycenter' w.r.t. 'Solar System Barycenter' for time span between 693230400 and 759585600
Registering SPK records for 'Mars' w.r.t. 'Mars Barycenter' for time span between 694245600 and 757274400
Registering SPK records for 'Jupiter Barycenter' w.r.t. 'Solar System Barycenter' for time span between 693230400 and 759585600
Registering SPK records for 'Jupiter' w.r.t. 'Jupiter Barycenter' for time span between 694159200 and 757339200
Registering SPK records for 'Saturn Barycenter' w.r.t. 'Solar System Barycenter' for time span between 693230400 and 759585600
Registering SPK records for 'Saturn' w.r.t. 'Saturn Barycenter' for time span between 694180800 and 757296000
Registering SPK records for 'Uranus Barycenter' w.r.t. 'Solar System Barycenter' for time span between 693230400 and 759585600
Registering SPK records for 'Uranus' w.r.t. 'Uranus Barycenter' for time span between 694008000 and 757598400
Registering SPK records for 'Neptune Barycenter' w.r.t. 'Solar System Barycenter' for time span between 693230400 and 759585600
Registering SPK records for 'Neptune' w.r.t. 'Neptune Barycenter' for time span between 693748800 and 757339200
Registering SPK records for 'Pluto Barycenter' w.r.t. 'Solar System Barycenter' for time span between 693230400 and 759585600
Registering SPK records for 'Pluto' w.r.t. 'Pluto Barycenter' for time span between 694008000 and 757771200
# Test cases

## Overview

Computing ephemeris with standard configuration for corrections (light time and star aberration corrections)

## Details

Folder: `./api/jpl/test/ephemeris-reference`, file name prefix: `WGC_StateVector`

## Results

Test suites: 10

| Target body | Observer body | Test cases | Avg ephemeris difference [°]  | File name |
| ----------- | ------------- | ---------- | ------------------------------- | --------- |
| Venus | Earth | 37 | 3.672e-9 | WGC_StateVector_20220817193429.csv |
| Mercury | Earth | 37 | 3.162e-9 | WGC_StateVector_20220819221628.csv |
| Pluto | Earth | 37 | 3.708e-9 | WGC_StateVector_20220819222002.csv |
| Moon | Earth | 37 | 3.611e-9 | WGC_StateVector_20220819222030.csv |
| Sun | Earth | 37 | 3.576e-9 | WGC_StateVector_20220819222042.csv |
| Mars | Earth | 37 | 0.00002959 | WGC_StateVector_20220819222108.csv |
| Jupiter | Earth | 37 | 3.286e-9 | WGC_StateVector_20220819222120.csv |
| Saturn | Earth | 37 | 3.725e-9 | WGC_StateVector_20220819222132.csv |
| Neptune | Earth | 37 | 3.483e-9 | WGC_StateVector_20220819222148.csv |
| Uranus | Earth | 37 | 3.418e-9 | WGC_StateVector_20220819222200.csv |
