#!/bin/bash

# https://naif.jpl.nasa.gov/pub/naif/

cd data

# curl https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de440.bsp -o de440.bsp

curl https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/mar097.bsp -o mar097.bsp
curl https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/mar097.cmt -o mar097.cmt
curl https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/satellites/mar097.inp -o mar097.inp