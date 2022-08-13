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

Computing body states without any corrections

## Details

Folder: `./api/jpl/test/uncorrected`, file name prefix: `WGC_StateVector`

Corrections: *none*

## Results

Test suites: 10

| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name |
| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- |
| Mercury | Earth | 37 | 2.639e-8 | 5.309e-9 | ./api/jpl/test/uncorrected/WGC_StateVector_20220727190826.csv |
| Jupiter | Earth | 37 | 7.684e-8 | 5.462e-9 | ./api/jpl/test/uncorrected/WGC_StateVector_20220802221423.csv |
| Mars | Earth | 37 | 115.8 | 6.218e-8 | ./api/jpl/test/uncorrected/WGC_StateVector_20220802225259.csv |
| Saturn | Earth | 37 | 1.780e-7 | 6.858e-9 | ./api/jpl/test/uncorrected/WGC_StateVector_20220802225311.csv |
| Venus | Earth | 37 | 3.385e-8 | 4.918e-9 | ./api/jpl/test/uncorrected/WGC_StateVector_20220802230546.csv |
| Uranus | Earth | 37 | 2.220e-7 | 8.794e-9 | ./api/jpl/test/uncorrected/WGC_StateVector_20220802230606.csv |
| Neptune | Earth | 37 | 4.939e-7 | 1.656e-8 | ./api/jpl/test/uncorrected/WGC_StateVector_20220802230619.csv |
| Pluto | Earth | 37 | 3.625e-7 | 1.278e-8 | ./api/jpl/test/uncorrected/WGC_StateVector_20220802230632.csv |
| Mars | Mars Barycenter | 37 | 2.318e-9 | 3.995e-17 | ./api/jpl/test/uncorrected/WGC_StateVector_20220803165555.csv |
| Mars Barycenter | Solar System Barycenter | 37 | 115.8 | 6.172e-8 | ./api/jpl/test/uncorrected/WGC_StateVector_20220803170949.csv |
# Test cases

## Overview

Computing body states with only light time correction applied

## Details

Folder: `./api/jpl/test/lightTimeCorrected`, file name prefix: `WGC_StateVector`

Corrections: 0

## Results

Test suites: 9

| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name |
| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- |
| Mercury | Earth | 37 | 2.479e-8 | Error: Velocity solving routine not implemented yet! | ./api/jpl/test/lightTimeCorrected/WGC_StateVector_20220812182335.csv |
| Venus | Earth | 37 | 2.924e-8 | Error: Velocity solving routine not implemented yet! | ./api/jpl/test/lightTimeCorrected/WGC_StateVector_20220812183524.csv |
| Mars | Earth | 37 | 115.8 | Error: Velocity solving routine not implemented yet! | ./api/jpl/test/lightTimeCorrected/WGC_StateVector_20220812183540.csv |
| Jupiter | Earth | 37 | 9.358e-8 | Error: Velocity solving routine not implemented yet! | ./api/jpl/test/lightTimeCorrected/WGC_StateVector_20220812183553.csv |
| Saturn | Earth | 37 | 1.980e-7 | Error: Velocity solving routine not implemented yet! | ./api/jpl/test/lightTimeCorrected/WGC_StateVector_20220812183606.csv |
| Neptune | Earth | 37 | 1.775e-7 | Error: Velocity solving routine not implemented yet! | ./api/jpl/test/lightTimeCorrected/WGC_StateVector_20220812183620.csv |
| Uranus | Earth | 37 | 2.681e-7 | Error: Velocity solving routine not implemented yet! | ./api/jpl/test/lightTimeCorrected/WGC_StateVector_20220812183634.csv |
| Pluto | Earth | 37 | 3.693e-7 | Error: Velocity solving routine not implemented yet! | ./api/jpl/test/lightTimeCorrected/WGC_StateVector_20220812183650.csv |
| Mars | Mars Barycenter | 37 | 1.997e-9 | Error: Velocity solving routine not implemented yet! | ./api/jpl/test/lightTimeCorrected/WGC_StateVector_20220812183758.csv |
