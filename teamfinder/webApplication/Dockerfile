FROM node:12.14.1

EXPOSE 8080

#in docker
WORKDIR /webApplication
# ./ = Where the file will end up in docker. Same name in docker 
# as in current folder.
COPY package*.json ./

RUN npm install

COPY src src

CMD ["npm", "start"]