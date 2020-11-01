set VOLUME_NAME=albedo-data
set CONTAINER_NAME=volumeSetup

docker container create --name %CONTAINER_NAME% -v %VOLUME_NAME%:/usr/data busybox

echo Downloading data from Minor Planet Center

curl https://www.minorplanetcenter.net/iau/MPCORB/CometEls.txt --output CometEls.txt
curl https://www.minorplanetcenter.net/iau/MPCORB/MPCORB.DAT.gz --output MPCORB.DAT.gz
gzip -d MPCORB.DAT.gz

echo Updating Minor Planet Center data in Docker Volume

docker run --rm -i -v=%VOLUME_NAME%:/usr/data busybox mkdir /usr/data/mpc
docker cp ./CometEls.txt %CONTAINER_NAME%:/usr/data/mpc
docker cp ./MPCORB.DAT %CONTAINER_NAME%:/usr/data/mpc

rm -f ./CometEls.txt
rm -f ./MPCORB.DAT*

echo Updating de438 data in Docker Volume

docker run --rm -i -v=%VOLUME_NAME%:/usr/data busybox mkdir /usr/data/de438
docker cp ./misc/de438/header.438 %CONTAINER_NAME%:/usr/data/de438
docker cp ./misc/de438/ascp01950.438 %CONTAINER_NAME%:/usr/data/de438

echo Updating OpenNGC data in Docker Volume

docker run --rm -i -v=%VOLUME_NAME%:/usr/data busybox mkdir /usr/data/OpenNGC
docker cp ./misc/OpenNGC/NGC.csv %CONTAINER_NAME%:/usr/data/OpenNGC
docker cp ./misc/OpenNGC/addendum/addendum.csv %CONTAINER_NAME%:/usr/data/OpenNGC

docker rm %CONTAINER_NAME%
