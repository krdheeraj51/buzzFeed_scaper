const helper = require('../util/helper');


var buzzFeedScraper = async function (page, timeoutCounter = 0) {
    console.log("Welcome home page.......");

    if (timeoutCounter >= 3) {
        return {
            status: "fail"
        }
    }
    timeoutCounter++;
    try {
        console.log("Welcome on BuzzFeed home page ............. ");

        await page.setRequestInterception(true);

        /**
         * Block google adds
         */
        const rejectRequestPattern = [
            "googlesyndication.com",
            "/*.doubleclick.net",
            "/*.amazon-adsystem.com",
            "/*.adnxs.com",
        ];
        const blockList = [];

        page.on("request", (request) => {
            if (rejectRequestPattern.find((pattern) => request.url().match(pattern))) {
                blockList.push(request.url());
                request.abort();
            } else request.continue();
        })
        let delay = await helper.generateRandomNumber(7000, 8000);
        await page.waitForTimeout(delay);


        await page.goto("https://www.buzzfeed.com/nusrat21/things-so-amazing-youll-break-into-song-dance");
        delay = await helper.generateRandomNumber(4000, 5000);
        await page.waitForTimeout(delay);
        let elements = await page.$x('//div[contains(@class,"buzz--list")]/div');
        delay = await helper.generateRandomNumber(4000, 5000);
        await page.waitForTimeout(delay);
        console.log("elements Length ::", elements.length)
        if (elements && elements.length) {
            for (let selectorIndex = 1; selectorIndex <= elements.length; selectorIndex++) {
                let getPrice = await getFeedPrice(page, selectorIndex);
                await addToWishList(page, selectorIndex, getPrice);
            }

        }
        delay = await helper.generateRandomNumber(4000, 5000);
        await page.waitForTimeout(delay);
        elements = await page.$x('//div[@data-module="subbuzz-image"]');
        if (elements && elements.length) {
            for (let selectorInd = 1; selectorInd <= elements.length; selectorInd++) {
                let getPrice = await getFeedPriceAnotherLayout(page, selectorInd);
                await addToWishListAnotherLayout(page, selectorInd, getPrice);

            }

        }

        return { status: true };

    } catch (err) {
        console.log("Error Details :::", err);
        let timeOutError = err.toString().match(/Timeout/i) || err.toString().match(/not visible/i);
        if (timeOutError && timeOutError.length > 0) {
            console.log('Error : Get Time-out Error at BuzzFeed Scraper.');
            return buzzFeedScraper(page, timeoutCounter);

        } else {
            return;
        }
    }
}


let getFeedPriceAnotherLayout = async (page, index) => {
    try {
        let price = 0;
        let elements = await page.$x(`//*[@id="mod-subbuzz-image-${index}"]/figure/div[2]/div[2]/p[2]/a`);
        if (elements && elements.length) {
            price = await page.evaluate(el => el.innerText, elements[0]);

            if (price && price.length && price.includes('$')) {
                price = parseFloat((price).split('$')[1]);

            } else {
                elements = await page.$x(`//*[@id="mod-subbuzz-image-${index}"]/figure/div[2]/div[2]/p[3]/a`);
                price = (await page.evaluate(el => el.innerText, elements[0]));
                if (price && price.length && price.includes('$')) {
                    price = parseFloat((price).split('$')[1]);
                } else {
                    elements = await page.$x(`//*[@id="mod-subbuzz-image-${index}"]/figure/div[2]/div[2]/p[3]/a[2]`);
                    if (elements && elements.length) {
                        price = (await page.evaluate(el => el.innerText, elements[0]));
                        if (price && price.length && price.includes('$')) {
                            price = parseFloat((price).split('$')[1]);
                        }
                    }
                }
            }
        }
        return price;



    } catch (err) {
        console.log("Error ::", err);
        throw err;
    }
}
let addToWishListAnotherLayout = async (page, index, price) => {
    try {
        let delay;
        if (price <= 25 && price !== 0) {
            console.log(`get Price :: ${price} ::: Index ::${index}`);
            let elements = await page.$x(`//*[@id="mod-subbuzz-image-${index}"]/div[2]/div/div/button`);
            if (elements && elements.length) {
                await elements[0].click();
                delay = await helper.generateRandomNumber(4000, 5000);
                await page.waitForTimeout(delay);
                let node = await page.$x("//div[text()='Select the product(s) to add to your Wishlist']");
                if (node && node.length) {
                    let checkBoxInput = await page.$x('//input[@id="productSelect0"]');
                    delay = await helper.generateRandomNumber(4000, 5000);
                    await page.waitForTimeout(delay);
                    if (checkBoxInput && checkBoxInput.length) {
                        // await checkBoxInput[0].click();
                        await page.evaluate(el => el.click(), checkBoxInput[0]);
                    }
                    delay = await helper.generateRandomNumber(4000, 5000);
                    await page.waitForTimeout(delay);
                    let confirmBtn = await page.$x("//button[@class='wishlist-button-multiple-products_submitButton__cUwgk wishlist-forms_button__RrESs ']");
                    await confirmBtn[0].click();
                }
                delay = await helper.generateRandomNumber(4000, 5000);
                await page.waitForTimeout(delay);
            }
        } 
        return true;

    } catch (err) {
        console.log(`Error ::${err}`);
        throw err;
    }
}


let getFeedPrice = async (page, index) => {
    try {
        let price = 0;
        let elements = await page.$x(`//*[@id="mod-subbuzz-photoset-${index}"]/figure/div[2]/div[2]/p[2]/a`);
        if (elements && elements.length) {
            price = await page.evaluate(el => el.innerText, elements[0]);

            if (price && price.length && price.includes('$')) {
                price = parseFloat((price).split('$')[1]);

            } else {
                elements = await page.$x(`//*[@id="mod-subbuzz-photoset-${index}"]/figure/div[2]/div[2]/p[3]/a`);
                price = (await page.evaluate(el => el.innerText, elements[0]));
                if (price && price.length && price.includes('$')) {
                    price = parseFloat((price).split('$')[1]);
                }
            }
        }
        return price;



    } catch (err) {
        console.log("Error ::", err);
        throw err;
    }
}
let addToWishList = async (page, index, price) => {
    try {
        if (price <= 25 && price !== 0) {
            console.log(`get Price :: ${price} ::: Index ::${index}`);
            let elements = await page.$x(`//*[@id="mod-subbuzz-photoset-${index}"]/div[1]/div/div/button`);
            if (elements && elements.length) {
                await elements[0].click();
                delay = await helper.generateRandomNumber(4000, 5000);
                await page.waitForTimeout(delay);
            }
        } 
        return true;

    } catch (err) {
        console.log(`Error ::${err}`);
        throw err;
    }
}



module.exports = {
    buzzFeedScraper
}
