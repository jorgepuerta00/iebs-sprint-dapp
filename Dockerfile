# first stage builds vue
FROM node:16 as build-stage
WORKDIR /build
COPY . .
RUN npm install
RUN npm run build

# second stage copies the static dist files and Node server files
FROM node:16 as production-stage
WORKDIR /app
COPY package.json server.js ./
COPY --from=build-stage /build/dist/ dist/
RUN npm install --omit=dev
RUN rm -rf build

# open port 5173 and run Node server
EXPOSE 5173
CMD [ "node", "server.js" ]