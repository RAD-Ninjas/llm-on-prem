FROM node:18-alpine AS base
RUN npm i -g pnpm

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build
WORKDIR /app
COPY . .
RUN mkdir -p /app
COPY --from=dependencies /app/node_modules /app/node_modules
RUN pnpm build
RUN pnpm prune --prod

FROM base AS deploy
WORKDIR /app
RUN mkdir -p /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules

EXPOSE 3000
CMD ["node", "dist/main"]