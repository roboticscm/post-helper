import { milliToDateStr } from '../lib';
import { imagePath } from '../constants';


export const batdongsan_com_vn = async (browser, postId, url, username, password, post, config, autoClose) => {

    return new Promise(async (resolve, reject) => {
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });
        const [loginButton] = await page.$x('//*[@id="kct_login"]');
        if(loginButton) {
            await loginButton.click();
            await page.waitForSelector('#UserName');
            await page.evaluate( (value) => document.querySelector('#UserName').value = value, username)
            await page.evaluate( (value) => document.querySelector('#Password').value = value, password)
            await page.click('.login-remember');
            await page.click('#btnLogin');
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
        }
        

        await page.waitForSelector('a[href="/dang-tin-rao-vat-ban-nha-dat"]');
        await page.click('a[href="/dang-tin-rao-vat-ban-nha-dat"]');
        // await page.waitForNavigation({ waitUntil: 'networkidle2' });

        await page.waitForSelector('#txtProductTitle20180807');
        await page.evaluate( (value) => document.querySelector('#txtProductTitle20180807').value = value, post.title)
        if(post.productTypeId) {
            await page.waitForTimeout(500);
            try {
                await page.waitForSelector('#divProductType');
                await page.click('#divProductType');
                await page.click(`[vl="${post.productTypeId}"]`)
            } catch (err) {
                console.error(err);
            }
        }
        
        if(post.productCateId) {
            try{
                await page.waitForTimeout(500);
                await page.waitForSelector('#divProductCate');
                await page.click('#divProductCate');
                await page.click(`[vl="${post.productCateId}"]`)
            } catch (err) {
                console.error(err);
            }
            
        }

        if(post.city) {
            try {
                
                await page.waitForSelector('#divCity');
                await page.click('#divCity');
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
                await page.waitForTimeout(500);
                await page.waitForSelector('#divDistrict');
                await page.click('#divDistrict');
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
                await page.waitForSelector('#divWard');
                await page.click('#divWard');
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
                await page.waitForTimeout(500);
                await page.waitForSelector('#divStreet');
                await page.click('#divStreet');
                const [street] = await page.$x(`//li[contains(text(), '${post.street}')]`);
                if (street) {
                    await street.click();
                }
            } catch (err) {
                console.error(err);
            }
        }

        if(post.projectId) {
            try {
                await page.waitForSelector('#divProject');
                await page.click('#divProject');
                await page.click(`[vl="${post.projectId}"]`)
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
                await page.evaluate( (value) => document.querySelector('#txtPrice').value = value, post.price)
            } catch (err) {
                console.error(err);
            }
        }
        
        if (post.unitId) {
            try {
                if(post.productTypeId === '38') {
                    await page.select('#ddlPriceType', `${post.unitId}`);
                } else {
                    await page.select('#ddlPriceType', `${post.unitId}`.replace('10', ''));
                }
            } catch (err) {
                console.error(err);
            }
        }
        
        if(post.description) {
            try {
                const contactInfo = `\n
                --------------------------
                Thông tin liên hệ:
                Tên: ${config.fullname}
                Địa chỉ: ${config.address}
                ĐT: ${config.phoneNumber}
                Email: ${config.email}
                `;
                await page.evaluate( (value) => document.querySelector('#txtDescription').value = value, post.description + contactInfo)
            } catch (err) {
                console.error(err);
            }
        }
        
        
        if(post.facade) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtWidth').value = value, post.facade)
            } catch (err) {
                console.error(err);
            }
        }

        if(post.frontLine) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtLandWidth').value = value, post.frontLine)
            } catch (err) {
                console.error(err);
            }
        }


        if (post.mainDoorDirectionId) {
            try {
                await page.select('#ddlHomeDirection', `${post.mainDoorDirectionId}`);
            } catch (err) {
                console.error(err);
            }
        }

        if (post.balconyDirectionId) {
            try {
                await page.select('#ddlBaconDirection', `${post.balconyDirectionId}`);
            } catch (err) {
                console.error(err);
            }
        }

        if(post.noFloors) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtFloorNumbers').value = value, post.noFloors)
            } catch (err) {
                console.error(err);
            }
        }

        if(post.noBedrooms) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtRoomNumber').value = value, post.noBedrooms)
            } catch (err) {
                console.error(err);
            }
        }


        if(post.noToilets) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtToiletNumber').value = value, post.noToilets)
            } catch (err) {
                console.error(err);
            }
        }


        if(post.legality) {
            try {
                await page.evaluate( (value) => document.querySelector('#txtLegality').value = value, post.legality)
            } catch (err) {
                console.error(err);
            }
        }

        
        if(config.fullname) {
            try {
                await page.evaluate((value) => document.querySelector('#txtBrName').value = value, config.fullname)
            } catch (err) {
                console.error(err);
            }
        }

        if(config.address) {
            try {
                await page.evaluate((value) => document.querySelector('#txtBrAddress').value = value, config.address)
            } catch (err) {
                console.error(err);
            }
        }

        if(config.phoneNumber) {
            try {
                await page.evaluate((value) => document.querySelector('#divBrMobile span input').value = value, config.phoneNumber)
            } catch (err) {
                console.error(err);
            }
        }

        if(config.email) {
            try {
                await page.evaluate((value) => document.querySelector('#txtBrEmail').value = value, config.email)
            } catch (err) {
                console.error(err);
            }
        }

        if (post.newsTypeId) {
            try {
                await page.select('#ddlVipType', `${post.newsTypeId}`);
            } catch (err) {
                console.error(err);
            }
        }

        

        if(post.startDate) {
            try {
                await page.evaluate((value) => document.querySelector('#txtStartDate').value = value, milliToDateStr(parseInt(post.startDate)))
            } catch (err) {
                console.error(err);
            }
        }

        if(post.endDate) {
            try {
                await page.evaluate((value) => document.querySelector('#txtEndDate').value = value, milliToDateStr(parseInt(post.endDate)))
            } catch (err) {
                console.error(err);
            }
        }
        

        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('[name="file"]')
        ]);

        try {
            await fileChooser.accept([`${imagePath}/${postId}/1.jpg`, `${imagePath}/${postId}/2.jpg`, `${imagePath}/${postId}/3.jpg`])
        } catch (err) {
            console.error(err);
            // reject();
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

        if (autoClose) {
            await page.close();
        }

        resolve();
    })

}

module.exports = batdongsan_com_vn;