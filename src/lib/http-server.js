'use strict';

const http = require('http');
const logger = require('./logger');
const requestParser = require('./request-parser');

const app = http.createServer((request, response) => {
  logger.log(logger.INFO, 'New Request');
  logger.log(logger.INFO, `METHOD: ${request.method}`);
  logger.log(logger.INFO, `ROUTE: ${request.url}`);

  return requestParser.parseAsynch(request)
    .then((parsedRequest) => {
      if (parsedRequest.method === 'GET' && parsedRequest.url === '/') {
        response.writeHead(200, { 'Content-Type': 'text/html' });
        logger.log(logger.INFO, 'Responding with 200 and HTML doc');

        response.write(`
        <!DOCTYPE html>
            <head>Head</head>
            <body>This is the body</body>
        </html>
        `);

        response.end();
        return null;
      }

      if (parsedRequest.method === 'POST' && parsedRequest.url === '/message') {
        response.writeHead(200, { 'Content-Type': 'application/json' });
        logger.log(logger.INFO, 'Responding with 200 and JSON doc');
        response.write('string');
        response.end();
        return null;
      }

      response.writeHead(404, { 'Content-Type': 'text/plain' });
      logger.log(logger.INFO, 'Responding with 404');
      response.write('Not Found');
      response.end();
      return null;
    })
    .catch(() => {
      response.writeHead(400, { 'Content-Type': 'text/plain' });
      logger.log(logger.INFO, 'Responding with 400');
      response.write('Bad Request');
      response.end();
      return null;
    });
});

const server = module.exports = {};

server.start = (port) => {
  return app.listen(port, () => {
    logger.log(logger.INFO, `Server up on PORT: ${port}`);
  });
};

server.stop = (port, callback) => {
  logger.log(logger.INFO, `Server on PORT: ${port} stopped`);
};
