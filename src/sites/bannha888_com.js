
import { selectOptionByText,  waitForNetworkIdle } from '../lib';
import { imagePath } from '../constants';



export const bannha888_com = async (browser, postId, url, username, password, post, config, autoClose) => {
    return new Promise(async (resolve, reject) => {
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
            await page.waitForNavigation({ waitUntil: 'networkidle2' });
        } 

        await page.waitForSelector('.fa-edit');
        const [postButton] = await page.$x('//a//i[contains(@class, "fa fa-edit")]');

        await postButton.click();
        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        await page.waitForSelector('#hinh_thuc');
        if (post.productTypeId) {
            try {
                await page.select('#hinh_thuc', `${post.productTypeId}`);
            } catch (err) {
                console.error(err);
            }
        }

        await page.waitForFunction(() => document.querySelector('#id_parent').length > 1);
        if (post.productCateId) {
            try {
                await page.select('#id_parent', `${post.productCateId}`);
            } catch (err) {
                console.error(err);
            }
        }
  
        if (post.city) {
            try {
                await selectOptionByText(page, 'ContentPlaceHolder2_ddlCustomers', post.city);
            } catch (err) {
                console.error(err);
            }
        }
       
        await page.waitForFunction(() => document.querySelector('#ContentPlaceHolder2_ddlOrders').length > 1);
        if (post.district) {
            try {
                await selectOptionByText(page, 'ContentPlaceHolder2_ddlOrders', post.district);
            } catch (err) {
                console.error(err);
            }
        }

        await page.waitForFunction(() => document.querySelector('#ContentPlaceHolder2_ddlProducts').length > 1);
        if (post.ward) {
            try {
                await selectOptionByText(page, 'ContentPlaceHolder2_ddlProducts', post.ward);
            } catch (err) {
                console.error(err);
            }
        }

        if (post.mainDoorDirectionId) {
            try {
                await page.select('#huong_bds', `${post.mainDoorDirectionId}`);
            } catch (err) {
                console.error(err);
            }
        }
        
        if(post.area) {
            try {
                await page.evaluate( (value) => document.querySelector('input[name="dien_tich"]').value = value, post.area)
            } catch (err) {
                console.error(err);
            }
        }

        if(post.price) {
            try {
                await page.evaluate( (value) => document.querySelector('input[name="giatien"]').value = value, post.price)
            } catch (err) {
                console.error(err);
            }
        }
        
        if (post.unitId) {
            try {
                await page.select('#dv_tiente', `${post.unitId}`);
            } catch (err) {
                console.error(err);
            }
        }
        
        if(post.facade) {
            try {
                await page.evaluate( (value) => document.querySelector('input[name="mat_tien"]').value = value, post.facade)
            } catch (err) {
                console.error(err);
            }
        }

        
        if(post.frontLine) {
            try {
                await page.evaluate( (value) => document.querySelector('input[name="duong_truoc_mat"]').value = value, post.frontLine)
            } catch (err) {
                console.error(err);
            }
        }

        if(post.noFloors) {
            try {
                await page.evaluate( (value) => document.querySelector('input[name="so_tang"]').value = value, post.noFloors)
            } catch (err) {
                console.error(err);
            }
        }

        if (post.noBedrooms) {
            try {
                if(parseInt(post.noBedrooms) <=10 ) {
                    await selectOptionByText(page, 'so_phong_ngu', post.noBedrooms);
                } else {
                    await page.select('#so_phong_ngu', '19933');
                    
                }
                
            } catch (err) {
                console.error(err);
            }
        }

        if (post.noToilets) {
            try {
                if(parseInt(post.noToilets) <=10 ) {
                    await selectOptionByText(page, 'so_phong_wc', post.noToilets);
                } else {
                    await page.select('#so_phong_wc', '19944');
                    
                }
                
            } catch (err) {
                console.error(err);
            }
        }

        if(post.title) {
            try {
                await page.evaluate( (value) => document.querySelector('input[name="tenbaiviet_vi"]').value = value, 'Bán gấp: ' + post.title)
            } catch (err) {
                console.error(err);
            }
        }

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
                await page.evaluate( (value) => document.querySelector('textarea[name="seo_description_vi"]').value = value, post.description + contactInfo)
                await page.evaluate( (value) => document.querySelector('.cke_wysiwyg_frame').contentDocument.body.innerHTML = value, ('Cần bán gấp: \n' + post.description + contactInfo).replace(/[\n\r]/g, '<br>'));
            } catch (err) {
                console.error(err);
            }
        }

        const [fileChooser] = await Promise.all([
            page.waitForFileChooser(),
            page.click('#upload_mutile_tindang')
        ]);

        try {
            await fileChooser.accept([`${imagePath}/${postId}/1.jpg`, `${imagePath}/${postId}/2.jpg`, `${imagePath}/${postId}/3.jpg`])
        } catch (err) {
            console.error(err);
            // reject();
        }
        await Promise.all([waitForNetworkIdle(page)]);
        
        const [doPostButton] = await page.$x('//a[@onclick="dang_tin_thuong_sub()"]');

        // await page.evaluate(function () {
        //     const image = document.querySelector('.dv-anh-js-load > div > img ');
        //     const imageSrc = image && image.src;

        //     let content = 'abc';
        //     if (imageSrc) {
        //         content += `
        //         <img src=${imageSrc} alt="anh">
        //     `;
        //     }

        //     document.querySelector('.cke_wysiwyg_frame').contentDocument.body.innerHTML = content;

        // })

        // await doPostButton.click();
        // if (autoClose) {
        //     await page.close();
        // }
       
        resolve();
    })

}

module.exports = bannha888_com;

