var http = require('http');
var Browser = require('zombie');
var browser = new Browser();
var startURL = 'http://spys.one/socks/';
var proxy = [];

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    try {
        browser.visit(startURL, function(){
        	browser.document.querySelector(".spy14 script").remove();
        	proxy = browser.document.querySelector(".spy14").textContent.split(':');
            switch (req.url){
                case '/telegram':
                    res.end(`<a href='tg://socks?server=${proxy[0]}&amp;port=${proxy[1]}&amp;user=&amp;pass='>
                        <img src='https://c.radikal.ru/c14/1804/04/f58d94e0fc3d.jpg' alt='Set Telegram Proxy' />
                        </a>`);
                break;
                default:
                    res.end(proxy.join(':'));
            }
        });    
    } catch(e){
        res.end(e);
    }
      
}).listen(process.env.PORT || 8080);