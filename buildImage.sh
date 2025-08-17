#!/bin/bash

set -ex

cd `dirname $0`

IMAGE_NAME=download-assistant

if [ ! $1 ]; then
  VERSION=`cat VERSION`
else
  VERSION=$1
fi

docker login --username=2177528133 --password=h97DPoWp-rG6Lm_K ccr.ccs.tencentyun.com

npm run clean
npm run tsc

docker build -t ${IMAGE_NAME}:${VERSION} . 

docker tag ${IMAGE_NAME}:${VERSION} ccr.ccs.tencentyun.com/quqi/${IMAGE_NAME}:${VERSION}
docker push ccr.ccs.tencentyun.com/quqi/${IMAGE_NAME}:${VERSION}
