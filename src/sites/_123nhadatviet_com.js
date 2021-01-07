import { milliToDateStr, selectOptionByText } from '../lib';
import { imagePath } from '../constants';

export const _123nhadatviet_com = async (browser, postId, url, username, password, post, config, autoClose) => {

    return new Promise(async (resolve, reject) => {
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });
        // click login link
        const [loginButton] = await page.$x('//*[@id="ctl00_pc_header"]/div[2]/div[2]/a[3]');
        if(loginButton) {
            await loginButton.click()
            // await page.waitForNavigation({ waitUntil: 'networkidle2' });
            await page.waitForSelector('#account');
            await page.evaluate((value) => document.querySelector('#account').value = value, username)
            await page.evaluate((value) => document.querySelector('#password').value = value, password)
            try{
                await page.click('#login-form > div.input-form > div:nth-child(5) > div.col2.button > span.login');
            } catch (err) {
                const [loginButton] = await page.$x('//*[@id="ctl00_pc_header"]/div[2]/div[2]/a[3]');
                await loginButton.click();
                await page.waitForSelector('#account');
                await page.evaluate((value) => document.querySelector('#account').value = value, username);
                await page.evaluate((value) => document.querySelector('#password').value = value, password);
                await page.click('#login-form > div.input-form > div:nth-child(5) > div.col2.button > span.login');
            }
            
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
            await page.waitForSelector('a[href="/dang-tin.html"]');
            await page.click('a[href="/dang-tin.html"]');
        } 
       

        await page.waitForSelector('#tieude');
        await page.evaluate((value) => document.querySelector('#tieude').value = value, post.title)

        if (post.description) {
            try {
                const contactInfo = `\n
                    Pháp lý: ${post.legality}
                    --------------------------
                    Thông tin liên hệ:
                    Tên: ${config.fullname}
                    Địa chỉ: ${config.address}
                    ĐT: ${config.phoneNumber}
                    Email: ${config.email}
                `;
                await page.evaluate((value) => document.querySelector('#noidung').value = value, post.description + contactInfo)
            } catch (err) {
                console.error(err);
            }
        }

        if (post.productTypeId) {
            try {
                await page.waitForSelector('#loaitin');
                await page.select('#loaitin', `${post.productTypeId}`);
            } catch (err) {
                console.error(err);
            }
        }

        if (post.productCateId) {
            try {
                await page.waitForSelector('#loaibds');
                await page.waitForTimeout(500);
                await page.select('#loaibds', `${post.productCateId}`);
            } catch (err) {
                console.error(err);
            }
        }

        if (post.city) {
            try {
                await page.waitForSelector('#tinh');
                await selectOptionByText(page, 'tinh', post.city);
            } catch (err) {
                console.error(err);
            }
        }

        if (post.district) {
            try {
                await page.waitForSelector('#huyen');
                await page.waitForTimeout(500);
                await selectOptionByText(page, 'huyen', post.district);
            } catch (err) {
                console.error(err);
            }
        }

        

        if(post.street) {
            try {
                await page.waitForTimeout(500);
                await page.waitForSelector('#street_acp_text');
                await page.click('#street_acp_text');
                const [street] = await page.$x(`//li[contains(text(), '${post.street}')]`);
                if (street) {
                    await street.click();
                }
            } catch (err) {
                console.error(err);
            }
        }


        if (post.ward) {
            try {
                await page.waitForSelector('#phuong');
                await page.waitForTimeout(500);
                await selectOptionByText(page, 'phuong', post.ward);
            } catch (err) {
                console.error(err);
            }
        }

        if (post.area) {
            try {
                await page.evaluate((value) => document.querySelector('#dientich').value = value, post.area)
            } catch (err) {
                console.error(err);
            }
        }

        if (post.price) {
            try {
                await page.evaluate((value) => document.querySelector('#gia').value = value, parseInt(post.price) * 1000000)
            } catch (err) {
                console.error(err);
            }
        }

        await page.select('#cachtinh', '1');


        if (post.facade) {
            try {
                await page.evaluate((value) => document.querySelector('#chieungang').value = value, post.facade)
            } catch (err) {
                console.error(err);
            }
        }

        if (post.mainDoorDirectionId) {
            try {
                await page.waitForSelector('#huong');
                await page.waitForTimeout(500);
                await page.select('#huong', `${post.mainDoorDirectionId}`)
            } catch (err) {
                console.error(err);
            }
        }

        if (post.frontLine) {
            try {
                await page.evaluate((value) => document.querySelector('#duongrong').value = value, post.frontLine)
            } catch (err) {
                console.error(err);
            }
        }

        if(post.legality) {
            try {
                await selectOptionByText(page, 'phaply', post.legality);
            } catch (err) {
                console.error(err);
            }
            
        }

        if(post.noFloors) {
            try {
                await page.evaluate( (value) => document.querySelector('#solau').value = value, post.noFloors)
            } catch (err) {
                console.error(err);
            }
        }

        if(post.noBedrooms) {
            try {
                await page.evaluate( (value) => document.querySelector('#sophongngu').value = value, post.noBedrooms)
            } catch (err) {
                console.error(err);
            }
        }


        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#form1 > div.upload-image-box > div:nth-child(2) > div:nth-child(1) > div > div.upload-controls > label:first-child.btnChooseImage'),
        ]);

        try {
            await fileChooser.accept([`${imagePath}/${postId}/1.jpg`])
        } catch (err) {
            console.error(err);
            // reject();
        }

        const [fileChooser2] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#form1 > div.upload-image-box > div:nth-child(2) > div:nth-child(2) > div.upload-controls > label:first-child.btnChooseImage ')
        ]);

        try {
            await fileChooser2.accept([`${imagePath}/${postId}/2.jpg`])
        } catch (err) {
            console.error(err);
            // reject();
        }

        const [fileChooser3] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#form1 > div.upload-image-box > div:nth-child(2) > div:nth-child(3) > div.upload-controls > label:first-child.btnChooseImage')
        ]);

        try {
            await fileChooser3.accept([`${imagePath}/${postId}/3.jpg`])
        } catch (err) {
            console.error(err);
            // reject();
        }

        // await page.waitForTimeout(500);
        // await page.click('a[id="lbtPost"][class="btnpost"]');
        // if (autoClose) {
        //     await page.close();
        // }

        resolve();
    })

}

module.exports = _123nhadatviet_com;