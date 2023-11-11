FROM node:18.18-alpine3.18 as build

WORKDIR /usr/src/app/

RUN npm install -g pnpm

COPY ./ ./

RUN pnpm install

RUN pnpm run build

RUN pnpm fetch --prod

RUN pnpm install -r --offline --prod

FROM node:18.18-alpine3.18

COPY --from=build /usr/src/app/dist/ /usr/src/app/
COPY --from=build /usr/src/app/node_modules /usr/src/app/node_modules

WORKDIR /usr/src/app/

ENTRYPOINT ["node", "main.js"]