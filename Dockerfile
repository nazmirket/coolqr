FROM node:20-alpine AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app/demo

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY demo/package.json demo/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY demo ./
RUN ./node_modules/.bin/nuxt build

FROM node:20-alpine AS runtime

ENV HOST=0.0.0.0
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app

COPY --from=build --chown=node:node /app/demo/.output ./.output

USER node
EXPOSE 3000

HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=4 \
	CMD wget --quiet --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", ".output/server/index.mjs"]
