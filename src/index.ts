import * as http from 'http';
const hostname = '0.0.0.0';
const port = 3000;

http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            console.log(body);
            res.end('ok');
        });
    }
}).listen(port, hostname, () => {
    console.log("server start at port 3000");
});