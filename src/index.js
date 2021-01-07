require('dotenv').config();
const pool = require('./db');
const puppeteer = require('puppeteer');
const config = require('../config.json');
const sha1 = require('js-sha1');



const main = async () => {
    try {
        config.password = sha1(`${process.env.PRIVATE_KEY || 'Skyhub@010116'}${config.password}`)
        const browser = await puppeteer.launch({
            headless: false, executablePath: 'node_modules/puppeteer/.local-chromium/mac-809590/chrome-mac/Chromium.app/Contents/MacOS/Chromium', defaultViewport: null, args: ["--start-fullscreen",
                /*"--user-data-dir=./Google/Chrome/User Data/"*/
            ], ignoreDefaultArgs: ["--disable-extensions"]
        });
        const autoCloseSites = (await pool.query(`SELECT * FROM get_sites($1, $2, $3)`, [config.username, config.password, true])).rows;
        const manualSites = (await pool.query(`SELECT * FROM get_sites($1, $2, $3)`, [config.username, config.password, false])).rows;
        
        for (let site of autoCloseSites) {
            const posts = (await pool.query(`SELECT * FROM get_posts($1, $2, $3)`, [site.name, config.username, config.password])).rows;
            for(let post of posts) {
                if(site.name === 'bannha888_com') {
                //     console.log(post);
                    await (require(`./sites/${site.name}`)(browser, post.id, site.url, site.username, site.password, post, config, true));
                }
            }
        }

        // for (let site of manualSites) {
        //     const posts = (await pool.query(`SELECT * FROM get_posts($1, $2, $3)`, [site.name, config.username, config.password])).rows;
        //     for(let post of posts) {
        //         if(site.name === 'batdongsan_com_vn') {
        //             console.log(post);
        //             await (require(`./sites/${site.name}`)(browser, post.id, site.url, site.username, site.password, post, config, false));
        //         }
                
        //     }
        // }
    } catch (err) {
        console.error(err)
    };

}

// main();

const printLinkList = async (url, username, password) => {
    const browser = await puppeteer.launch({
        headless: false, executablePath: 'node_modules/puppeteer/.local-chromium/mac-809590/chrome-mac/Chromium.app/Contents/MacOS/Chromium', defaultViewport: null, args: ["--start-fullscreen",
            /*"--user-data-dir=./Google/Chrome/User Data/"*/
        ], ignoreDefaultArgs: ["--disable-extensions"]
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const [loginButton] = await page.$x('//a[@class="cur"]//i[contains(@class, "fa fa-user-circle-o")]');
    if(loginButton) {
        await loginButton.click();
        await page.waitForSelector('#txt_pass');
        await page.evaluate( (value) => document.querySelector('input[name="txt_email"]').value = value, username)
        await page.evaluate( (value) => document.querySelector('input[name="txt_pass"]').value = value, password)
        const [doLoginButton] = await page.$x('//a[@id="dangnhap"]');
        await doLoginButton.click();
       
    } 
    await page.waitForNavigation({ waitUntil: 'networkidle2' });


    await page.waitForSelector('#mm-0 > div:nth-child(2) > article > section > div.header > div > div.company_time > ul.right_header > li.images-user > a')
    await page.click('#mm-0 > div:nth-child(2) > article > section > div.header > div > div.company_time > ul.right_header > li.images-user > a');
    await page.waitForSelector('#mm-0 > div:nth-child(2) > article > section > div.conten > div.pagewrap.page_conten_page > div.right_conten > div:nth-child(2) > div.padding_pagewrap_2 > div > ul > li:nth-child(2) > a');
    await page.click('#mm-0 > div:nth-child(2) > article > section > div.conten > div.pagewrap.page_conten_page > div.right_conten > div:nth-child(2) > div.padding_pagewrap_2 > div > ul > li:nth-child(2) > a');
    
    await page.waitForSelector('#mm-0 > div:nth-child(2) > article > section > div.conten > div.pagewrap.page_conten_page > div.left_conten > div > div.padding_pagewrap_2 > div.dv-list-tindang')
   
    await page.evaluate(() => {
        const div = document.querySelector('.dv-list-tindang');
        if(div) {
            div.querySelectorAll('.grmb-anh').forEach((d, index) => {
                if(index >=0 && index <= 50) {
                    console.log(`${index + 1}. ${d.getElementsByTagName('a')[0].href}`)
                }
                
            })
        }
        
    })
}

printLinkList('https://bannha888.com', 'khai79.phuongnam.thienkhoihcm@gmail.com', 'AaBb12345@');