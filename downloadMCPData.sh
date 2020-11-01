#!/bin/bash

echo Downloading data from Minor Planet Center

# curl https://www.minorplanetcenter.net/iau/MPCORB/MPCORB.DAT.gz --output MPCORB.DAT.gz
curl https://www.minorplanetcenter.net/iau/MPCORB/CometEls.txt --output CometEls.txt
