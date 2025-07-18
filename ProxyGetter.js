const Zombie = require('zombie');

const startUrl = 'http://spys.one/proxylist/';
// chrome 60 | хром 60
const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36';
const requestInterval = 1000 * 60 * 10;
/**
 * Gets open HTTP(S) proxies from spys.one website
 * Получает открытые http(s) прокси с сайта spys.one
 * @export
 * @class ProxyGetter
 */
module.exports = class ProxyGetter {
    /**
     * Creates an instance of ProxyGetter.
     * Создает экземпляр ProxyGetter.
     * @memberof ProxyGetter
     */
    constructor() {
        this.proxyArray = [];
        this._browser = new Zombie({ userAgent: userAgent });
        setInterval(() => this.requestForProxy(), requestInterval);
        this.promise = this.requestForProxy();
    }
    /**
     * Gets proxies from the website
     * Runs _requestForProxyInner until it gets a result
     * 
     * Получение прокси с сайта
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
     * Makes a request to spys.one and parses proxies
     * Retrieved proxies are stored in this.proxyArray
     * 
     * Запрос к spys.one и парсинг прокси
     * Полученные прокси записываются в this.proxyArray
     * 
     * @return {Boolean} Whether proxies were successfully retrieved | Успешно ли получены прокси
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
        // b.visit может выбросить TagError если google analytics подключается к странице
        try {
            await b.visit(startUrl);
        } catch (err) {
            if (err.name !== 'TagError') {
                console.log(err);
                return false;
            }
        }
        // Remove all <script> tags from the page after loading
        // Удаляем все <script> со страницы после загрузки
        const scripts = b.document.querySelectorAll("script");
        for (let script of scripts){
            script.remove();
        }
        // Remove all unnecessary text elements
        // Удаляем все лишние надписи
        const els = b.document.querySelectorAll('.spy5');
        for (let el of els){
            el.remove();
        }
        // Find the table with the data we need
        // Находим таблицу с нужными нам данными
        const dataRows = b.document.querySelector('.spy1xx').parentNode.childNodes;
        // dataRows = Array.prototype.slice.call(dataRows);
        // First two and last three rows are headers and footers that we don't need
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
     * Gets a proxy from the array
     * Получение прокси из массива
     * @return {String} Proxy address in format http(s)://ip:port | Адрес прокси в формате http(s)://ip:port
     * @memberof ProxyGetter
     */
    getProxy() {
        if (!this.isEmpty()) {
            return this.proxyArray.pop();
        }
        return null;
    }
    /**
     * Returns true when this.proxyArray.length == 0
     * Returns false when this.proxyArray.length > 0
     * 
     * Возвращает true, когда this.proxyArray.length == 0
     * Возвращает false, когда this.proxyArray.length > 0
     * @return {Boolean}
     * @memberof ProxyGetter
     */
    isEmpty() {
        return !this.proxyArray.length;
    }
};