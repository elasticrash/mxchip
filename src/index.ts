import * as http from 'http';
import * as sqlite3 from 'sqlite3';

const hostname = '0.0.0.0';
const sqlite = sqlite3.verbose();
const port = 3000;
var db = new sqlite.Database('./timedb.sqlite');

http.createServer((req, res) => {
    if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                db.serialize(() => {
                    const data = JSON.parse(body);
                    db.run("INSERT INTO TimeSeries (temperature, humidity, date, location) VALUES (?, ? ,?, ?)", [
                        data.temperature,
                        data.humidity,
                        new Date().toUTCString(),
                        data.location
                    ]);
                });
            } catch (error) {
                console.log(error);
            }
            console.log(new Date().toUTCString());
            console.log(body);
            res.end('ok');
        });
    }
}).listen(port, hostname, () => {
    console.log("server start at port 3000");
});