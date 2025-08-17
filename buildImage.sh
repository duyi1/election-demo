#!/bin/bash

set -ex

cd `dirname $0`

IMAGE_NAME=election-demo

if [ ! $1 ]; then
  VERSION=`cat VERSION`
else
  VERSION=$1
fi

npm run clean
npm run tsc

docker build -t ${IMAGE_NAME}:${VERSION} . 

docker tag ${IMAGE_NAME}:${VERSION} xxx.com/${IMAGE_NAME}:${VERSION}
docker push xxx.com/${IMAGE_NAME}:${VERSION}
