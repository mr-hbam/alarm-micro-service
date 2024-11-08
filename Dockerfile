FROM node:21-alpine3.18 as builder
ENV NODE_ENV build
WORKDIR /home/node
COPY --chown=node:node . /home/node
RUN yarn install
USER node
RUN yarn build

FROM  node:21-alpine3.18
ENV NODE_ENV production
WORKDIR /home/node
COPY --from=builder /home/node/package*.json /home/node/
COPY --from=builder /home/node/node_modules/ /home/node/node_modules/
COPY --from=builder /home/node/dist/ /home/node/dist/
CMD [ "node", "/home/node/dist/adapters/primaries/nest/main.js" ]
