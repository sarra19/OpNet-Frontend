#stage 1 
FROM node:14-alpine as node
WORKDIR /
COPY . .


#stage 2
FROM nginx:alpine
COPY --from=node /build /usr/share/nginx/html