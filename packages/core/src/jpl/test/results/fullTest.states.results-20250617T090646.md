# State

## State without correction

| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name | Kernels |
| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- | ------- |
| Mercury | Earth | 37 | 2.639e-8 | 5.309e-9 | WGC_StateVector_20220727190826.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Jupiter | Earth | 37 | 7.684e-8 | 5.462e-9 | WGC_StateVector_20220802221423.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars | Earth | 37 | 115.8 | 6.218e-8 | WGC_StateVector_20220802225259.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Saturn | Earth | 37 | 0.001143 | 6.858e-9 | WGC_StateVector_20220802225311.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Venus | Earth | 37 | 3.385e-8 | 4.918e-9 | WGC_StateVector_20220802230546.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Uranus | Earth | 37 | 2.220e-7 | 8.794e-9 | WGC_StateVector_20220802230606.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Neptune | Earth | 37 | 4.939e-7 | 1.656e-8 | WGC_StateVector_20220802230619.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Pluto | Earth | 37 | 1.450 | 0.00001633 | WGC_StateVector_20220802230632.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars | Mars Barycenter | 37 | 2.318e-9 | 3.995e-17 | WGC_StateVector_20220803165555.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars Barycenter | Solar System Barycenter | 37 | 115.8 | 6.172e-8 | WGC_StateVector_20220803170949.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Moon | Earth Moon Barycenter | 49 | 4.521e-9 | 4.885e-9 | WGC_StateVector_20250616162500.csv | pds/wgc/mk/latest_lsk_v0004.tm, generic_kernels/spk/planets/de440.bsp |
| Mercury | Earth | 30 | 3.103e-8 | 5.196e-9 | WGC_StateVector_20250616185950.csv | pds/wgc/mk/latest_lsk_v0004.tm, generic_kernels/spk/planets/de440.bsp |
## State with light time correction applied

| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name | Kernels |
| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- | ------- |
| Mercury | Earth | 37 | 2.479e-8 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220812182335.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Venus | Earth | 37 | 2.924e-8 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220812183524.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars | Earth | 37 | 115.8 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220812183540.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Jupiter | Earth | 37 | 9.358e-8 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220812183553.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Saturn | Earth | 37 | 0.001144 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220812183606.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Neptune | Earth | 37 | 1.775e-7 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220812183620.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Uranus | Earth | 37 | 2.681e-7 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220812183634.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Pluto | Earth | 37 | 1.449 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220812183650.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars | Mars Barycenter | 37 | 1.997e-9 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220812183758.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars Barycenter | Solar System Barycenter | 36 | Error: Cannot find SPK Kernel record data for target: 0 | Error: Cannot find SPK Kernel record data for target: 0 | WGC_StateVector_20220816193347.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
## State with star aberration and light time correction applied

| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name | Kernels |
| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- | ------- |
| Mercury | Earth | 37 | 1.847e-7 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220816210748.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Venus | Earth | 37 | 2.146e-7 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220816210929.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Moon | Earth | 37 | 2.463e-8 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220816210945.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars | Earth | 37 | 115.8 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220816211000.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Jupiter | Earth | 37 | 9.749e-7 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220816211014.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Saturn | Earth | 37 | 0.001144 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220816211027.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Uranus | Earth | 37 | 0.000004345 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220816211041.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Neptune | Earth | 37 | 0.000005882 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220816211053.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Pluto | Earth | 37 | 1.449 | Error: Velocity solving routine not implemented yet! | WGC_StateVector_20220816211107.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars Barycenter | Solar System Barycenter | 37 | Error: Cannot find SPK Kernel record data for target: 0 | Error: Cannot find SPK Kernel record data for target: 0 | WGC_StateVector_20220816211205.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Solar System Barycenter | Mars Barycenter | 37 | Error: Cannot find SPK Kernel record data for target: 0 | Error: Cannot find SPK Kernel record data for target: 0 | WGC_StateVector_20220816211222.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
## State without correction. New State Solver.

| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name | Kernels |
| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- | ------- |
| Mercury | Earth | 37 | 2.639e-8 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220727190826.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Jupiter | Earth | 37 | 7.684e-8 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220802221423.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars | Earth | 37 | 115.8 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220802225259.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Saturn | Earth | 37 | 0.001143 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220802225311.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Venus | Earth | 37 | 3.385e-8 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220802230546.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Uranus | Earth | 37 | 2.220e-7 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220802230606.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Neptune | Earth | 37 | 4.939e-7 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220802230619.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Pluto | Earth | 37 | 1.450 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220802230632.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars | Mars Barycenter | 37 | 2.318e-9 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220803165555.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars Barycenter | Solar System Barycenter | 37 | 115.8 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220803170949.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Moon | Earth Moon Barycenter | 49 | 4.521e-9 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20250616162500.csv | pds/wgc/mk/latest_lsk_v0004.tm, generic_kernels/spk/planets/de440.bsp |
| Mercury | Earth | 30 | 3.103e-8 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20250616185950.csv | pds/wgc/mk/latest_lsk_v0004.tm, generic_kernels/spk/planets/de440.bsp |
## State with light time correction applied. New State Solver.

| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name | Kernels |
| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- | ------- |
| Mercury | Earth | 37 | 2.456e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220812182335.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Venus | Earth | 37 | 2.099e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220812183524.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars | Earth | 37 | 1.691e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220812183540.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Jupiter | Earth | 37 | 3.398e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220812183553.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Saturn | Earth | 37 | 4.587e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220812183606.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Neptune | Earth | 37 | 8.158e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220812183620.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Uranus | Earth | 37 | 6.522e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220812183634.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Pluto | Earth | 37 | 9.272e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220812183650.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars | Mars Barycenter | 37 | 1.030e-8 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220812183758.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars Barycenter | Solar System Barycenter | 36 | 1.828e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816193347.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
## State with star aberration and light time correction applied. New State Solver.

| Target body | Observer body | Test cases | Avg postion error [km] | Avg velocity error [km/s] | File name | Kernels |
| ----------- | ------------- | ---------- | ---------------------- | ------------------------- | --------- | ------- |
| Mercury | Earth | 37 | 3.181e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816210748.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Venus | Earth | 37 | 3.416e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816210929.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Moon | Earth | 37 | 24.27 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816210945.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars | Earth | 37 | 2.463e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816211000.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Jupiter | Earth | 37 | 6.108e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816211014.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Saturn | Earth | 37 | 1.029e+5 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816211027.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Uranus | Earth | 37 | 1.959e+5 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816211041.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Neptune | Earth | 37 | 2.910e+5 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816211053.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Pluto | Earth | 37 | 3.394e+5 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816211107.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Mars Barycenter | Solar System Barycenter | 37 | 1.828e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816211205.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |
| Solar System Barycenter | Mars Barycenter | 37 | 1.822e+4 | Error: Velocity calculation not implemented yet! | WGC_StateVector_20220816211222.csv | pds/wgc/mk/ground_stations_v0014.tm, pds/wgc/mk/solar_system_v0045.tm, pds/wgc/mk/latest_lsk_v0004.tm |