#!/bin/bash -v
# Program to compile,  build the docker images,
# and modify the version number for the different elements
if [[ "$PWD" = */scripts ]]; then
  cd ..
fi
. scripts/setenv.sh

# Get current version if the version is not the first argument of this command line
prev=$(grep -o 'v\([0-9]\+.\)\{2\}\([0-9]\+\)' server/config/config.json | head -1)

if [ $# -gt 0 ]
then
  if [ $1 -eq "auto"]
  then
     rep=yes
  else
  	v=v$1
    sed -i -e "s/$prev/$v/g" server/config/config.json
    rm server/config/config.json-e
  fi
else
  v=$prev
fi
echo 'old version: ' $prev ' new version to use:' $v

echo 'compile angular app'
ng build --prod
echo 'Build Docker image'
# Build docker
docker build -t ibmcase/casewebportal .
if [  -z "$rep" ]; then
  read -p 'Push to dockerhub?: (yes)/no' rep
fi
if [ -z "$rep" ]
then
  echo "Pushing..."
  docker login
  docker push ibmcase/casewebportal:$v
fi
