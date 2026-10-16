FROM node:24-alpine AS build

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.9 --activate

COPY package.json pnpm-lock.yaml tsconfig.json ./
RUN pnpm install --frozen-lockfile

COPY src ./src
RUN pnpm build

COPY demo ./demo
RUN pnpm --dir demo install --frozen-lockfile
RUN pnpm --dir demo build

FROM node:24-alpine AS runtime

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
