#!/bin/bash -v
# Program to compile,  build the docker images,
# and modify the version number for the different elements
if [[ "$PWD" = */scripts ]]; then
  cd ..
fi
. scripts/setenv.sh

# Get current version from config if a new version is not specified as first argument of this command line
# then use this one
prev=$(grep -o 'v\([0-9]\+.\)\{2\}\([0-9]\+\)' server/config/config.json | head -1)

if [ $# -gt 0 ]
then
  if [ $1 -eq "auto"]
  then
     rep="yes"
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
# ng build --prod --deploy-url /portal/ --base-href /portal/ --output-path dist/portal
ng build
echo 'Build Docker image'
# Build docker
docker build -t ibmcase/casewebportal:$v .
if [  -z "$rep" ]
then
  read -p 'Push to dockerhub?: (yes)/no: ' rep
fi
if [ -z "$rep" ] || [ "$rep" -eq "yes" ]
then
  echo "Pushing..."
  docker login
  docker push ibmcase/casewebportal:$v
fi
