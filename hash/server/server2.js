const http = require('http');
const fs = require('fs');

http.createServer((req, res) => {
  const html = fs.readFileSync('../html/index2.html', 'utf8');
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })
  res.end(html)
}).listen(9999, () => {
  console.log("server is listening on 9999");
})