FROM node:alpine
MAINTAINER https://github.com/ibm-cloud-architecture - IBM - Jerome Boyer

COPY . /caseportal
WORKDIR /caseportal

# RUN npm install && \
#     npm install -g @angular/cli && \
#    npm run build

EXPOSE 6100

CMD node server/server.js
