require('dotenv').config();
const { launchBrowser, isBrowserExists } = require('./services/browser');
const { buzzFeedScraper } = require('./modules/buzzFeedScraper');


async function init() {
    try {
        console.log("Buzz Feed Scraper starts");
        return await startUp();

    } catch (err) {
        if (err.toString().match(/Session closed/i)) {
            return setTimeout(init(), 1000);
        }
        await new Promise(resolve => {
            setTimeout(() => resolve(true), 15000);
        });
    }
}
init()

/**
 * Script initialization
 */
async function startUp() {
    try {
        let browserInstance = await launchBrowser();
        let browser = browserInstance.browser;
        let page = browserInstance.page;
        await page.waitForTimeout(5000);

        await page.waitForTimeout(5000);
        
        await buzzFeedScraper(page);

        console.log("task has been completed .....");

        await new Promise(resolve => {
            setTimeout(() => resolve(true), 15000);
        });
        /**
         * After processing order close Browser
         */
         if (isBrowserExists()) await browser.close();


    } catch (err) {
        console.log("Error ::", err);
        throw err;
    }
}




