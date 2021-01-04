require('dotenv').config();

const puppeteer = require('puppeteer');
const fs = require('fs');
const pool = require('./db');

const bannha888 = async () => {
    const savedCookies = require('../bannha888_com.json')
    const browser = await puppeteer.launch({headless: false, executablePath: '/Users/khailv/Desktop/post-helper/dist/.local-chromium/mac-809590/chrome-mac/Chromium.app/Contents/MacOS/Chromium', defaultViewport: null, args: ["--start-fullscreen"]});
    const page = await browser.newPage();
    
    if (Object.keys(savedCookies).length) {
        await page.setCookie(...savedCookies);
        await page.goto('https://bannha888.com', {waitUntil: 'networkidle2'});
    } else {
        await page.goto('https://bannha888.com', {waitUntil: 'networkidle2'});
        const [loginButton] = await page.$x('//a[@class="cur"]//i[contains(@class, "fa fa-user-circle-o")]');
        await loginButton.click();
        await page.waitForSelector('#txt_pass');
        await page.type('input[name="txt_email"]', 'khai79.phuongnam.thienkhoihcm@gmail.com');
        await page.type('input[name="txt_pass"]', 'AaBb12345@');
        const [doLoginButton] = await page.$x('//a[@id="dangnhap"]');
        await doLoginButton.click();
    
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        const cookies = await page.cookies();
        fs.writeFileSync('bannha888_com.json', JSON.stringify(cookies));
    } 

    await page.waitForSelector('.fa-edit');
    const [postButton] = await page.$x('//a//i[contains(@class, "fa fa-edit")]');

    await postButton.click();
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    await page.select('#hinh_thuc', '5');
    await page.waitForFunction(() => document.querySelector('#id_parent').length > 1);
    await page.select('#id_parent', '8');
    await page.select('#ContentPlaceHolder2_ddlCustomers', '17783');
    await page.waitForFunction(() => document.querySelector('#ContentPlaceHolder2_ddlOrders').length > 1);
    await page.select('#ContentPlaceHolder2_ddlOrders', '17916');
    await page.waitForFunction(() => document.querySelector('#ContentPlaceHolder2_ddlProducts').length > 1);
    await page.select('#ContentPlaceHolder2_ddlProducts', '17924');
    
    await page.type('input[name="dien_tich"]', '100');
    await page.type('input[name="tenbaiviet_vi"]', 'tieu de');
    
    await page.evaluate(function() {           
        document.getElementsByName('seo_description_vi')[0].value = 'your-new-text';
    })

 
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('#upload_mutile_tindang')
    ]);
    
    try {
        await fileChooser.accept(['/Users/khailv/Desktop/Screen Shot 2021-01-01 at 3.11.00 PM1.png'])
    } catch(err) {
        console.error(err);
    }
    
    const [doPostButton] = await page.$x('//a[@onclick="dang_tin_thuong_sub()"]');

    await page.evaluate(function() {
        const image = document.querySelector('.dv-anh-js-load > div > img ');         
        const imageSrc = image && image.src;

        let content = 'abc';
        if(imageSrc) {
            content += `
                <img src=${imageSrc} alt="anh">
            `;
        } 

        document.querySelector('.cke_wysiwyg_frame').contentDocument.body.innerHTML=content;
        
    })
    await doPostButton.click();
}

// bannha888();




const batdongsan_com_vn = async () => {
    const savedCookies = require('../batdongsan_com_vn.json')
    const browser = await puppeteer.launch({headless: false, executablePath: 'node_modules/puppeteer/.local-chromium/mac-809590/chrome-mac/Chromium.app/Contents/MacOS/Chromium', defaultViewport: null, args: ["--start-fullscreen", 
        /*"--user-data-dir=./Google/Chrome/User Data/"*/
    ], ignoreDefaultArgs: ["--disable-extensions"]}, 
    );
    const page = await browser.newPage();

    if (Object.keys(savedCookies).length) {
        await page.setCookie(...savedCookies);
        await page.goto('https://batdongsan.com.vn', {waitUntil: 'networkidle2'});
    } else {
        await page.goto('https://batdongsan.com.vn', {waitUntil: 'networkidle2'});
        await page.click('#kct_login')
        await page.waitForSelector('#UserName');
        await page.type('input[id="UserName"]', 'khai79.phuongnam.thienkhoihcm@gmail.com');
        await page.type('input[id="Password"]', 'AaBb12345@');
        await page.click('.login-remember');
        await page.click('#btnLogin');
        await page.waitForNavigation({ waitUntil: 'networkidle2' });
    
        try{
            await page.waitForSelector('.user-avatar');
        } catch(err) {
            process.exit(0);
        }
        const cookies = await page.cookies();
        fs.writeFileSync('batdongsan_com_vn.json', JSON.stringify(cookies));
    }
    
    await page.waitForSelector('#linkPostProduct');
    await page.click('#linkPostProduct');
    // await page.waitForNavigation({ waitUntil: 'networkidle2' });

    await page.waitForSelector('#txtProductTitle20180807');
    await page.type('input[id="txtProductTitle20180807"]', 'tieu de dfasf dsaf dsaf dsafdsa dsafd');
    await page.waitForTimeout(500);
    await page.waitForSelector('#divProductType');
    await page.click('#divProductType');
    await page.click('[vl="38"]')


    await page.waitForSelector('#divProductCate');
    await page.click('#divProductCate');
    await page.click('[vl="41"]')

    await page.waitForSelector('#divCity');
    await page.click('#divCity');
    const [city] = await page.$x("//li[contains(text(), 'Hồ Chí Minh')]");
    if (city) {
        await city.click();
    } 
    
    await page.waitForSelector('#divDistrict');
    await page.click('#divDistrict');
    await page.click('[vl="66"]')

    await page.waitForSelector('#divWard');
    await page.click('#divWard');
    await page.click('[vl="8889"]')

    await page.waitForSelector('#divStreet');
    await page.click('#divStreet');
    await page.click('[vl="1998"]')
    
    await page.waitForSelector('#divProject');
    await page.click('#divProject');
    await page.click('[vl="1973"]')
    
    await page.type('input[id="txtArea"]', '40');
    await page.type('input[id="txtPrice"]', '5');

    // await page.select('#ddlPriceType', '2');
    await page.evaluate(() => {
        $("#ddlPriceType option:contains('Triệu')")[0].selected = true
    })

    await page.evaluate(function() {           
        document.querySelector('#txtDescription').value = 'mô tả';
    })
    
    // await page.select('#hinh_thuc', '5');
    // await page.waitForFunction(() => document.querySelector('#id_parent').length > 1);
    // await page.select('#id_parent', '8');
    // await page.select('#ContentPlaceHolder2_ddlCustomers', '17783');
    // await page.waitForFunction(() => document.querySelector('#ContentPlaceHolder2_ddlOrders').length > 1);
    // await page.select('#ContentPlaceHolder2_ddlOrders', '17916');
    // await page.waitForFunction(() => document.querySelector('#ContentPlaceHolder2_ddlProducts').length > 1);
    // await page.select('#ContentPlaceHolder2_ddlProducts', '17924');
    
    // await page.type('input[name="dien_tich"]', '100');
    // await page.type('input[name="tenbaiviet_vi"]', 'tieu de');
    
    // await page.evaluate(function() {           
    //     document.getElementsByName('seo_description_vi')[0].value = 'your-new-text';
    // })

 
    const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('[name="file"]')
    ]);
    
    try {
        await fileChooser.accept(['/Users/khailv/Desktop/Screen Shot 2021-01-01 at 3.11.00 PM.png'])
    } catch(err) {
        console.error(err);
    }
    
    // const [doPostButton] = await page.$x('//a[@onclick="dang_tin_thuong_sub()"]');

    // await page.evaluate(function() {
    //     const image = document.querySelector('.dv-anh-js-load > div > img ');         
    //     const imageSrc = image && image.src;

    //     let content = 'abc';
    //     if(imageSrc) {
    //         content += `
    //             <img src=${imageSrc} alt="anh">
    //         `;
    //     } 

    //     document.querySelector('.cke_wysiwyg_frame').contentDocument.body.innerHTML=content;
        
    // })
    // await doPostButton.click();
}



// batdongsan_com_vn();

const main = async () => {
    const result = await pool.query(`SELECT * FROM get_posts($1::TEXT, $2::TEXT)`, ['khailv', 'c7f2e0e1fff0ac93c989676a1d9358c008cc11ef']);
    for(let post of result.rows) {
        console.log(post);
    }
}


module.exports = require('./site');
module.exports['test']()
