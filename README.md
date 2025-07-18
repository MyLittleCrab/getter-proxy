# Getter-Proxy / Получатель Прокси

[English](#english) | [Русский](#русский)

---

## English

A Node.js library for parsing and extracting fresh HTTP/HTTPS proxies from spys.one with server-side JavaScript execution.

### Features

- 🔄 Automatic proxy scraping from spys.one
- 🔁 Automatic retry mechanism with interval-based updates
- 🌐 Support for both HTTP and HTTPS proxies
- 🤖 Browser automation using Zombie.js
- 📦 Simple and lightweight API
- ⚡ Real-time proxy validation through rotation

### Installation

```bash
npm install
```

### Dependencies

- **zombie**: Headless browser for web scraping and JavaScript execution

### Quick Start

```javascript
const ProxyGetter = require('./ProxyGetter');

async function main() {
    const proxyGetter = new ProxyGetter();
    
    // Wait for the first data request to complete
    await proxyGetter.promise;
    
    // Get all available proxies
    while (!proxyGetter.isEmpty()) {
        console.log(proxyGetter.getProxy());
    }
}

main();
```

### API Reference

#### Constructor

```javascript
const proxyGetter = new ProxyGetter();
```

Creates a new ProxyGetter instance that automatically starts fetching proxies with a 10-minute interval.

#### Methods

##### `getProxy()`
Returns a proxy address in the format `protocol://ip:port`

**Returns:** `String | null` - Proxy address or null if no proxies available

##### `isEmpty()`
Checks if the proxy array is empty

**Returns:** `Boolean` - true if no proxies available, false otherwise

##### `requestForProxy()`
Manually triggers proxy fetching (automatically called every 10 minutes)

**Returns:** `Promise<void>`

### Configuration

- **Request Interval**: 10 minutes (600,000 ms)
- **User Agent**: Chrome 60 compatible
- **Target URL**: http://spys.one/proxylist/

### How it Works

1. The library visits spys.one using a headless browser
2. Removes scripts and unnecessary elements from the page
3. Parses the proxy table to extract IP addresses and protocols
4. Stores proxies in an internal array for consumption
5. Automatically rotates through proxies for subsequent requests

### License

This project is provided as-is for educational purposes.

---

## Русский

Node.js библиотека для парсинга и извлечения свежих HTTP/HTTPS прокси с сайта spys.one с выполнением JavaScript на стороне сервера.

### Возможности

- 🔄 Автоматический сбор прокси с spys.one
- 🔁 Автоматический механизм повторных попыток с интервальными обновлениями
- 🌐 Поддержка HTTP и HTTPS прокси
- 🤖 Автоматизация браузера с использованием Zombie.js
- 📦 Простой и легкий API
- ⚡ Валидация прокси в реальном времени через ротацию

### Установка

```bash
npm install
```

### Зависимости

- **zombie**: Headless браузер для веб-скрапинга и выполнения JavaScript

### Быстрый старт

```javascript
const ProxyGetter = require('./ProxyGetter');

async function main() {
    const proxyGetter = new ProxyGetter();
    
    // Ожидание завершения первого запроса за данными
    await proxyGetter.promise;
    
    // Получение всех доступных прокси
    while (!proxyGetter.isEmpty()) {
        console.log(proxyGetter.getProxy());
    }
}

main();
```

### Справочник API

#### Конструктор

```javascript
const proxyGetter = new ProxyGetter();
```

Создает новый экземпляр ProxyGetter, который автоматически начинает получение прокси с интервалом в 10 минут.

#### Методы

##### `getProxy()`
Возвращает адрес прокси в формате `протокол://ip:порт`

**Возвращает:** `String | null` - Адрес прокси или null если прокси недоступны

##### `isEmpty()`
Проверяет, пуст ли массив прокси

**Возвращает:** `Boolean` - true если прокси недоступны, false в противном случае

##### `requestForProxy()`
Вручную запускает получение прокси (автоматически вызывается каждые 10 минут)

**Возвращает:** `Promise<void>`

### Конфигурация

- **Интервал запросов**: 10 минут (600,000 мс)
- **User Agent**: Совместимый с Chrome 60
- **Целевой URL**: http://spys.one/proxylist/

### Как это работает

1. Библиотека посещает spys.one используя headless браузер
2. Удаляет скрипты и ненужные элементы со страницы
3. Парсит таблицу прокси для извлечения IP-адресов и протоколов
4. Сохраняет прокси во внутреннем массиве для использования
5. Автоматически ротирует прокси для последующих запросов

### Лицензия

Этот проект предоставляется как есть для образовательных целей.
