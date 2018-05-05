#!/bin/bash -v
# Program to compile,  build the docker images,
# and modify the version number for the different elements
if [[ "$PWD" = */scripts ]]; then
  cd ..
fi
. scripts/setenv.sh

# Get current version if the version is not the first argument of this command line
prev=$(grep -o 'v\([0-9]\+.\)\{2\}\([0-9]\+\)' server/config/config.json | head -1)

if [[ $# -gt 0 ]]; then
	v=v$1
else
  v=$prev
fi
echo 'old version: ' $prev ' new version to use:' $v
echo 'Update version in config file'
sed -i -e "s/$prev/$v/g" server/config/config.json
rm server/config/config.json-e

echo 'compile angular app'
ng build
