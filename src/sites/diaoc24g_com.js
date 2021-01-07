import { milliToDateStr } from '../lib';
import { selectOptionByText, selectOption2ByText } from '../lib';
import { imagePath } from '../constants';

export const diaoc24g_com = async (browser, postId, url, username, password, post, config, autoClose) => {

    return new Promise(async (resolve, reject) => {
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('a[href="/dang-nhap"]');
        await page.click('a[href="/dang-nhap"]')
        await page.waitForSelector('#username');
        await page.evaluate( (value) => document.querySelector('#username').value = value, username)
        await page.evaluate( (value) => document.querySelector('input[name="password"]').value = value, password)
        await page.click('input[type="submit"][value="Đăng nhập"][class="button"]');

        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        try {
            await page.waitForSelector('a[class="ui-dialog-titlebar-close ui-corner-all"]');
            await page.click('a[class="ui-dialog-titlebar-close ui-corner-all"]');
        } catch (err) {
            console.error(err);
        }
        
        
        await page.waitForSelector('a[href="/dang-tin-rao-vat-nha-dat"]');
        await page.click('a[href="/dang-tin-rao-vat-nha-dat"]');

        if (post.newsTypeId) {
            try {
                await page.waitForSelector('#viptype');
                await page.select('#viptype', `${post.newsTypeId}`);
            } catch (err) {
                console.error(err);
            }
        }

        if(post.city) {
            try {
                await page.waitForSelector('#cboCity');
                await page.waitForTimeout(500);
                await selectOptionByText(page, 'cboCity', post.city);
            } catch (err) {
                console.error(err);
            }
        }

        if (post.productTypeId) {
            try {
                await page.select('#cboCategory', `${post.productTypeId}`);
            } catch (err) {
                console.error(err);
            }
        }

        if (post.productCateId) {
            try {
                await page.waitForTimeout(500);
                await page.select('#cboTypeRe', `${post.productCateId}`);
            } catch (err) {
                console.error(err);
            }
        }
        
        
        if(post.legality) {
            try {
                await page.waitForSelector('select[name="chu_quyen"]');
                await page.waitForTimeout(500);
                await selectOption2ByText(page, 'chu_quyen', post.legality);
            } catch (err) {
                console.error(err);
            }
        }


         if (post.mainDoorDirectionId) {
            try {
                await page.waitForSelector('select[name="huong_nha"]');
                await page.waitForTimeout(500);
                await page.select('select[name="huong_nha"]', `${post.mainDoorDirectionId}`);
            } catch (err) {
                console.error(err);
            }
        }
        
        if(post.district) {
            try {
                await page.waitForSelector('#cboDistrict');
                await page.waitForTimeout(500);
                await selectOptionByText(page, 'cboDistrict', post.district);
            } catch (err) {
                console.error(err);
            }
        }

        if(post.ward) {
            try {
                await page.waitForSelector('#cboWard');
                await page.waitForTimeout(500);
                await selectOptionByText(page, 'cboWard', post.ward);
            } catch (err) {
                console.error(err);
            }
        }

        if(post.street) {
            try {
                await page.waitForSelector('#cboStreet');
                await page.waitForTimeout(500);
                await selectOptionByText(page, 'cboStreet', post.street);
            } catch (err) {
                console.error(err);
            }
        }

        

        if(post.projectId) {
            try {
                await page.waitForSelector('#cboProject');
                await page.select('#cboProject', `${post.projectId}`);
            } catch (err) {
                console.error(err);
            }
        }
        
        
        if(post.area) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtArea').value = value, post.area)
            } catch (err) {
                console.error(err);
            }
        }
        
        if(post.price) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtPrice').value = value, parseInt(post.price)*1000000000)
            } catch (err) {
                console.error(err);
            }
        }
        
        await page.select('#ddlPriceType', `4`);
        
        
        
        await page.evaluate( (value) => document.querySelector('#tieu_de').value = value, post.title)

        if(post.description) {
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
                await page.evaluate( (value) => document.querySelector('#noi_dung').value = value, post.description + contactInfo)
            } catch (err) {
                console.error(err);
            }
        }

        if(config.fullname) {
            try {
                await page.evaluate((value) => document.querySelector('input[name="ten_lien_he"]').value = value, config.fullname)
            } catch (err) {
                console.error(err);
            }
        }

        if(config.phoneNumber) {
            try {
                await page.evaluate((value) => document.querySelector('input[name="di_dong_lien_he"]').value = value, config.phoneNumber)
            } catch (err) {
                console.error(err);
            }
        }

        if(config.address) {
            try {
                await page.evaluate((value) => document.querySelector('input[name="dia_chi_lien_he"]').value = value, config.address)
            } catch (err) {
                console.error(err);
            }
        }

        if(post.frontLine) {
            try {
                await page.evaluate( (value) => document.querySelector('input[name="duong_vao"]').value = value, post.frontLine)
            } catch (err) {
                console.error(err);
            }
        }

        
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#formdangtin > div:nth-child(6) > div.detail-box-admin > div > div:nth-child(1) > div.upload-controls > label:first-child.btnChooseImage'),
        ]);

        try {
            await fileChooser.accept([`${imagePath}/${postId}/1.jpg`])
        } catch (err) {
            console.error(err);
            // reject();
        }

        const [fileChooser2] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#formdangtin > div:nth-child(6) > div.detail-box-admin > div > div:nth-child(2) > div.upload-controls > label:first-child.btnChooseImage'),
        ]);

        try {
            await fileChooser2.accept([`${imagePath}/${postId}/2.jpg`])
        } catch (err) {
            console.error(err);
            // reject();
        }

        const [fileChooser3] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#formdangtin > div:nth-child(6) > div.detail-box-admin > div > div:nth-child(3) > div.upload-controls > label:first-child.btnChooseImage'),
        ]);

        try {
            await fileChooser3.accept([`${imagePath}/${postId}/3.jpg`])
        } catch (err) {
            console.error(err);
            // reject();
        }

        // const [doPostButton] = await page.$x('//a[@onclick="dang_tin_thuong_sub()"]');
        // await doPostButton.click();

        if (autoClose) {
            await page.close();
        }

        resolve();
    })

}

module.exports = diaoc24g_com;