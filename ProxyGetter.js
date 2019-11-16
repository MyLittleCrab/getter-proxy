const Zombie = require('zombie');

const startUrl = 'http://spys.one/proxylist/';
// chrome 60
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
const requestInterval = 1000 * 60 * 10;
/**
 * Получает открытые http(s) прокси с сайта spys.one
 * @export
 * @class ProxyGetter
 */
module.exports = class ProxyGetter {
    /**
     * Creates an instance of ProxyGetter.
     * @memberof ProxyGetter
     */
    constructor() {
        this.proxyArray = [];
        this._browser = new Zombie({ userAgent: userAgent });
        setInterval(() => this.requestForProxy(), requestInterval);
        this.promise = this.requestForProxy();
    }
    /**
     * Получение прокси
     * Запускает _requestForProxyInner пока не получит результат
     * @memberof ProxyGetter
     */
    async requestForProxy(){
        let result = false;
        while(result !== true){
            result = await this._requestForProxyInner();
        }
    }

    /**
     * Запрос к spys.one и парсинг прокси
     * Полученные прокси записываются в this.proxyArray
     * 
     * @return {Boolean} Успешно ли получены прокси
     * @memberof ProxyGetter
     */
    async _requestForProxyInner() {
        const b = this._browser;
        if (this.proxyArray.length) {
            b.proxy = this.getProxy();
        } else {
            b.proxy = null;
        }

        // b.visit may throw TagError if google analytics connect to the page
        try {
            await b.visit(startUrl);
        } catch (err) {
            if (err.name !== 'TagError') {
                console.log(err);
                return false;
            }
        }
        // удаляем все <script> со страницы после загрузки
        const scripts = b.document.querySelectorAll("script");
        for (let script of scripts){
            script.remove();
        }
        // удаляем все лишние надписи
        const els = b.document.querySelectorAll('.spy5');
        for (let el of els){
            el.remove();
        }
        // находим таблицу с нужными нам данными
        const dataRows = b.document.querySelector('.spy1xx').parentNode.childNodes;
        // dataRows = Array.prototype.slice.call(dataRows);
        // Первые две и последние три строки -- заголовки и футеры, которые нам не интересны
        this.proxyArray = [];
        for (let i = 2; i < dataRows.length - 3; i++) {
            let row = dataRows[i];
            let ip = row.querySelector('.spy14').textContent.replace(/\s+/g, '');
            let protocol = row.childNodes[1].textContent.toLowerCase().replace(/\s+/g, '');
            this.proxyArray.push(protocol + '://' + ip);
        }
        return !this.isEmpty();
    }
    /**
     * Получение прокси
     * @return {String} Адрес прокси в формате http(s)://ip:port
     * @memberof ProxyGetter
     */
    getProxy() {
        if (!this.isEmpty()) {
            return this.proxyArray.pop();
        }
        return null;
    }
    /**
     * Возвращает true, когда this.proxyArray.length == 0
     * false, когда this.proxyArray.length > 0
     * @return {Boolean}
     * @memberof ProxyGetter
     */
    isEmpty() {
        return !this.proxyArray.length;
    }
};