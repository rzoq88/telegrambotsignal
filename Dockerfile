FROM node:18.1.0
WORKDIR /Bot1
ENV PORT 88
COPY package.json /Bot1/package.json
RUN npm install
COPY . .
CMD ["node", "index.js"]