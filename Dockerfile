# Stage 1 - Building react app
FROM node:10-alpine as react-build

WORKDIR /app

COPY package.json /app
RUN npm install
COPY . /app
COPY .env.production /app

# Replace all environment variables which will be set at runtime with placeholders
RUN cat .env.production | grep = | sort | sed -e 's|REACT_APP_\([a-zA-Z_]*\)=\(.*\)|REACT_APP_\1=NGINX_REPLACE_\1|' > .env.production

ARG REACT_APP_GITHUB_URL='https://github.com/recipe-repo/recipe-repo'
RUN npm run build


# Stage 2 - the production environment
FROM nginx:alpine

ENV API_URL 'http://localhost:3664'

# This is a hack around the envsubst nginx config. Because we have `$uri` set up,
# it would replace this as well. Now we just reset it to its original value.
ENV uri \$uri

WORKDIR /etc/nginx/conf.d
COPY nginx.conf.sample nginx.conf.sample
COPY .env.production .
COPY script.sh .
COPY --from=react-build /app/build /usr/share/nginx/html
EXPOSE 80

# Install envsubst
RUN apk add gettext libintl
CMD ["/bin/sh", "script.sh"] 