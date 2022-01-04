rem curl https://naif.jpl.nasa.gov/pub/naif/generic_kernels/spk/planets/de440.bsp --output ../Albedo-data/header.bsp

rem curl https://www.minorplanetcenter.net/iau/MPCORB/CometEls.txt --output ../Albedo-data/CometEls.txt
rem curl https://www.minorplanetcenter.net/iau/MPCORB/MPCORB.DAT.gz --output ../Albedo-data/MPCORB.DAT.gz
rem gzip -d ../Albedo-data/MPCORB.DAT.gz

curl ftp://ssd.jpl.nasa.gov/pub/eph/planets/ascii/de438/header.438  --output ../Albedo-data/header.438
curl ftp://ssd.jpl.nasa.gov/pub/eph/planets/ascii/de438/ascp01950.438  --output ../Albedo-data/ascp01950.438

rem https://github.com/mattiaverga/OpenNGC.git