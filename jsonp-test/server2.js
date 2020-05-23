const http = require('http');
const url = require("url");

http.createServer((req, res) => {
  const param = url.parse(req.url, true).query;
  const cbName = param.callback;
  const resData = {
    data: { userCode: 123, password: 456 },
    code: 200,
    codeMsg: 'success'
  }
  res.end(`${cbName}(${JSON.stringify(resData)})`)
}).listen(9999, () => {
  console.log("server is listening on 9999");
})