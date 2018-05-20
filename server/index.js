import http from 'http';

const port = (process.env.PORT || 1337);

http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\nI am CJ Odina');
}).listen(port);

console.log(`Server running on port ${port}/`);
