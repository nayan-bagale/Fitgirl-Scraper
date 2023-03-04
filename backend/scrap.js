const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const Agent = require('agentkeepalive');   
const HttpsAgent = require('agentkeepalive').HttpsAgent;

const keepAliveAgent = new Agent({
    maxSockets: 160,
    maxFreeSockets: 160,
    timeout: 60000,
    freeSocketTimeout: 30000,
    keepAliveMsecs: 60000 });

const httpsKeepAliveAgent = new HttpsAgent({
    maxSockets: 160,
    maxFreeSockets: 160,
    timeout: 60000,
    freeSocketTimeout: 30000,
    keepAliveMsecs: 60000 });

const axiosInstance = axios.create({
    baseURL: 'https://fitgirl-repacks.site/',
    httpAgent: keepAliveAgent,
    httpsAgent: httpsKeepAliveAgent });

const html = async(url) => {
    return await axios.get(url);
}

async function scrapUrl(url) {
    const arr = []
    let raw = await html(url)
    const $ = cheerio.load(raw.data);
    $('.lcp_catlist li').each(function(i, li) {
        let link = $(li).find('a').attr('href')
        arr.push(link)

    })
    return arr
}

async function scrapPage(url){
    let obj = {}
    let raw = await html(url)
    const $ = cheerio.load(raw.data);
    let a = $('.entry-content h3 strong').text();
    
    let b = $('.entry-content p').first().text();
    b = b.split('\n')
    if(b[1] !== undefined){
        let temp = b[1].split(':')
        if(temp[1] === undefined) return false
       temp = temp[1].split(',')
       obj.title = a;
       obj.genres = temp;
       obj.link = url
       return obj
    }else{
        return false
    }
}

async function page(num){
    let main = []
    for(let i=1; i<=num; i++){
        let links = await scrapUrl(`https://fitgirl-repacks.site/all-my-repacks-a-z/?lcp_page0=${i}#lcp_instance_0`)
        links.forEach(async(e) => {
            let data = await scrapPage(e)
            if(!data) return

           main.push(data)
        })
    }
    fs.writeFile('data.json', JSON.stringify(main), function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
      
    return main
}

page(65)

module.exports = page