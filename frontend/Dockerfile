# Stage 0, compile frontend to static html
FROM node:13.12.0-alpine as build-stage

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# add app
COPY . ./

# build app
RUN npm run build


# Stage 1, run nginx
FROM nginx:latest

# Set up default env attributes
ARG port=80
ARG frontend_name=127.0.0.1
ARG backend_url=http://127.0.0.1:8000

ENV PORT=$port
ENV FRONTEND_NAME=$frontend_name
ENV BACKEND_URL=$backend_url

COPY --from=build-stage /app/build/ /usr/share/nginx/html

COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf.template

CMD /bin/bash -c "envsubst '\$PORT \$BACKEND_URL \$FRONTEND_NAME' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"
