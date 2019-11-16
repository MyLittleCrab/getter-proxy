const ProxyGetter = require('./ProxyGetter');

async function main(){
    const proxyGetter = new ProxyGetter();
    // Ожидание завершения первого запроса за данными 
    await proxyGetter.promise;
    
    while(!proxyGetter.isEmpty()){
        console.log(proxyGetter.getProxy());
    }
}

main();