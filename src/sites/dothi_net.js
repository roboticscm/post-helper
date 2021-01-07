import { milliToDateStr } from '../lib';
import { selectOptionByText,  waitForNetworkIdle } from '../lib';
import { imagePath } from '../constants';

export const dothi_net = async (browser, postId, url, username, password, post, config, autoClose) => {

    return new Promise(async (resolve, reject) => {
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });
        const [loginButton] = await page.$x('//*[@id="ButtonLogin"]');
        if(loginButton) {
            await loginButton.click()
            await page.waitForTimeout(500);
            await page.waitForSelector('#txtUserName');
            await page.evaluate( (value) => document.querySelector('#txtUserName').value = value, username)
            await page.evaluate( (value) => document.querySelector('#txtPassword').value = value, password)
            await page.click('#btnLogin');
            
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
        }
        
        await page.waitForSelector('a[href="/thanh-vien/dang-tin-ban-cho-thue-nha-dat.htm"]');
        await page.click('a[href="/thanh-vien/dang-tin-ban-cho-thue-nha-dat.htm"]');

        await page.waitForSelector('#hplSell');
        if(post.productTypeId === '1') {
            await page.click('#hplSell')
        } else {
            await page.click('#hplRent')
        }
        
        if(post.productCateId) {
            try{
                await page.waitForSelector('#cboCateP div ul li');
                await page.click('#cboCateP');
                await page.click(`[rel="${post.productCateId}"]`)
            } catch (err) {
                console.error(err);
            }   
        }

        if(post.city) {
            try {
                await page.waitForSelector('#select2-ddlCity-container');
                await page.click('#select2-ddlCity-container');
                const [city] = await page.$x(`//li[contains(text(), '${post.city}')]`);
                if (city) {
                    await city.click();
                }
            } catch (err) {
                console.error(err);
            }
        }
        

        if(post.district) {
            try {
                await page.waitForTimeout(1000);
                await page.waitForSelector('#select2-ddlDistrict-container');
                await page.click('#select2-ddlDistrict-container');
                const [district] = await page.$x(`//li[contains(text(), '${post.district}')]`);
                if (district) {
                    await district.click();
                }
            } catch (err) {
                console.error(err);
            }
        }
        

        if(post.ward) {
            try {
                await page.waitForTimeout(500);
                await page.waitForSelector('#select2-ddlWard-container');
                await page.click('#select2-ddlWard-container');
                const [ward] = await page.$x(`//li[contains(text(), '${post.ward}')]`);
                if (ward) {
                    await ward.click();
                }
            } catch (err) {
                console.error(err);
            }
        }
        
        if(post.street) {
            try {
                await page.waitForSelector('#select2-ddlStreets-container');
                await page.click('#select2-ddlStreets-container');
                const [street] = await page.$x(`//li[contains(text(), '${post.street}')]`);
                if (street) {
                    await street.click();
                }
            } catch (err) {
                console.error(err);
            }
        }
        
        
        if(post.price) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtGia').value = value, post.price)
            } catch (err) {
                console.error(err);
            }
        }
        
        if (post.unitId) {
            try {
                await page.waitForTimeout(500);
                if(post.productTypeId === '1') {
                    await page.waitForSelector('#cboPriceP');
                    await page.click('#cboPriceP');
                    await page.click(`[rel="${post.unitId}"]`)
                } else {
                    await page.waitForSelector('#cboPriceP');
                    await page.click('#cboPriceP');
                    await page.click(`[rel="${post.unitId.replace('10', '')}"]`)
                }
            } catch (err) {
                console.error(err);
            }
        }
        
        if(post.area) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtDientich').value = value, post.area)
            } catch (err) {
                console.error(err);
            }
        }

        if(post.facade) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtMattien').value = value, post.facade)
            } catch (err) {
                console.error(err);
            }
        }

        if(post.frontLine) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtDuongtruocnha').value = value, post.frontLine)
            } catch (err) {
                console.error(err);
            }
        }

        if(post.noFloors) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtSotang').value = value, post.noFloors)
            } catch (err) {
                console.error(err);
            }
        }

        
        
        if(post.noBedrooms) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtSophong').value = value, post.noBedrooms)
            } catch (err) {
                console.error(err);
            }
        }

         if (post.mainDoorDirectionId) {
            try {
                await page.waitForSelector('#cboDirectionP');
                await page.waitForTimeout(500);
                await page.click('#cboDirectionP');
                await page.waitForTimeout(500);
                await page.click(`[rel='${post.mainDoorDirectionId}']`)
            } catch (err) {
                console.error(err);
            }
        }


        if(post.noToilets) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtSotoilet').value = value, post.noToilets)
            } catch (err) {
                console.error(err);
            }
        }

        await page.waitForSelector('#txtTieude');
        await page.evaluate( (value) => document.querySelector('#txtTieude').value = value, post.title)

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
                await page.evaluate( (value) => document.querySelector('#tarNoidung').value = value, post.description + contactInfo)
            } catch (err) {
                console.error(err);
            }
        }

        await page.waitForTimeout(500)
        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#uploadimage > div')
        ]);

        try {
            await fileChooser.accept([`${imagePath}/${postId}/1.jpg`, `${imagePath}/${postId}/2.jpg`, `${imagePath}/${postId}/3.jpg`])
        } catch (err) {
            console.error(err);
            // reject();
        }
        await Promise.all([waitForNetworkIdle(page)]);

        
        if(config.fullname) {
            try {
                await page.evaluate((value) => document.querySelector('#txtHovaten').value = value, config.fullname)
            } catch (err) {
                console.error(err);
            }
        }

        if(config.address) {
            try {
                await page.evaluate((value) => document.querySelector('#txtDiachi').value = value, config.address)
            } catch (err) {
                console.error(err);
            }
        }

        if(config.phoneNumber) {
            try {
                await page.evaluate((value) => document.querySelector('#txtDidong').value = value, config.phoneNumber)
            } catch (err) {
                console.error(err);
            }
        }

        if(config.email) {
            try {
                await page.evaluate((value) => document.querySelector('#txtEmail').value = value, config.email)
            } catch (err) {
                console.error(err);
            }
        }

        if (post.newsTypeId) {
            try {
                await page.waitForTimeout(500);
                await page.click(`#hpVip${post.newsTypeId}`);
            } catch (err) {
                console.error(err);
            }
        }

        

        await page.waitForTimeout(500);
        await page.click('a[id="lbtPost"][class="btnpost"]');
        if (autoClose) {
            await page.close();
        }

        resolve();
    })

}

module.exports = dothi_net;