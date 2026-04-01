FROM node:22-alpine AS base

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps

COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

FROM deps AS dev

ENV NODE_ENV=development

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]

FROM deps AS builder

ENV NODE_ENV=production

COPY . .

RUN npm run build

FROM base AS runner

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0"]