# Test suites

## Full Test

Set of tests designed to assess computaion quality of this library defined as a average differance between computed and referenced values received from https://wgc.jpl.nasa.gov:8443/webgeocalc/#StateVector according to the followin equations (error for position, error for velocity respectively):

$$\varepsilon=\frac{1}{n}\sum_{t = 1}^{n} \left |\vec{S_t} - \vec{S{t}'}  \right |$$
$$\varepsilon_v=\frac{1}{n}\sum_{t = 1}^{n} \left |\vec{V_t} - \vec{V{t}'}  \right |$$

Where:
$S_t$, $S_{t}'$ indicates position vectors (referenced and computed) at time $t$ and $V_t$, $V_{t}'$ indicates velocity vectors (referenced and computed).

[Results](fullTest.results.md)
