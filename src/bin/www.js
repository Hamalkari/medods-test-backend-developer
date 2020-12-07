const app = require('../app');
const http = require('http');

const { port } = require('../config');

const server = http.createServer(app.callback());

server.listen(port);

server.on('listening', () => {
  console.log(`Server listening on http://localhost:${port}`);
});
