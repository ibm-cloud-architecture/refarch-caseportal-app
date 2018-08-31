#!/bin/bash
cd chart
helm lint browncompute-caseportal-app
helm package browncompute-caseportal-app
echo 'copy create package to charts folder in root repo'
cp browncompute-caseportal-app*.tgz ../../refarch-integration/charts
cd ..
