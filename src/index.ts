import * as http from 'http';
import * as sqlite3 from 'sqlite3';
import * as url from 'url';

const URLSearchParams = url.URLSearchParams;
const hostname = '0.0.0.0';
const sqlite = sqlite3.verbose();
const port = 3000;
var db = new sqlite.Database('./timedb.sqlite');

http.createServer((req: any, res: any) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                db.serialize(() => {
                    const data = JSON.parse(body);
                    db.run("INSERT INTO TimeSeries (temperature, humidity, date, location) VALUES (?, ? ,?, ?, ?)", [
                        data.temperature,
                        data.humidity,
                        new Date().toUTCString(),
                        data.location,
                        Date.now() / 1000 | 0
                    ]);
                });
            } catch (error) {
                console.log(error);
            }
            console.log(new Date().toUTCString());
            console.log(body);
            res.end('ok');
        });
    } else if (req.method === 'GET') {
        const search_params = new URLSearchParams(req.url.split('?')[1]);
        const from = search_params.get('from');
        const to = search_params.get('to');
        db.serialize(() => {
            db.all("SELECT * FROM TimeSeries WHERE timestamp > ? AND timestamp < ?", [from, to], (err, rows) => {
                res.end(JSON.stringify(rows));
            });
        });
    }
}).listen(port, hostname, () => {
    console.log("server start at port 3000");
});