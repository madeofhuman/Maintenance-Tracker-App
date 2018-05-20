import http from 'http';

const port = (process.env.PORT || 1337);

if (!module.parent) {
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\nI am CJ Odina');
  }).listen(port, '127.0.0.1');
}

console.log(`Server running at http://127.0.0.1:${port}/`);
