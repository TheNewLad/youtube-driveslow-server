const feed2json = require('feed2json');
const fetch = require('fetch');
const fetchUrl = fetch.fetchUrl;
const http = require('http');

let url = "https://www.youtube.com/feeds/videos.xml?channel_id=UC2t38_hyT_uJnZEY2gwbtBw";

http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*'
    });
    youtubeToJson(url, res);
}).listen(process.env.PORT || 4000);

function youtubeToJson(url, res) {
    fetchUrl(url, function (error, meta, body) {
        // console.log(body.toString());
        let xml = body.toString();
        feed2json.fromString(xml, url, (err, data) => {
            // check for err
            // otherwise `json` is populated with JSONFeed format
            if (err) {
                console.warn(err)
                data = { err: 'Error processing feed' }
                res.write(JSON.stringify(data));
                res.end();
            } else {
                // console.log(data.items[0]);
                res.writeHead(301, 
                    {Location: data.items[0].url}
                );
                // res.write(JSON.stringify(data.items[0].url));
                res.end();
            }
        })
    });
}