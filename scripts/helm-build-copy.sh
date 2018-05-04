#!/bin/bash
cd chart
helm lint casewebportal
helm package casewebportal
echo 'copy create package to charts folder in root repo'
cp casewebportal*.tgz ../../refarch-integration/charts
cd ..
