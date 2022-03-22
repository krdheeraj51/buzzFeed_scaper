const fs = require('fs');
const path = require('path');
async function generateRandomNumber(min, max) {
    const a = Math.floor(Math.random() * (max - min + 1)) + min;
    return a;
}
const clickEvent = async (page, xpath) => {
    const elements = await page.$x(xpath);
    if (elements && elements.length) {
        await elements[0].click();
        await page.waitForTimeout(4000);
    }
}
function typeDelay() {
    return Math.round(Math.random() * 10);
}

async function flush(domElement) {
    await domElement.focus();
    await domElement.click({ clickCount: 3 });
    await domElement.press('Backspace');
}

module.exports = {
    generateRandomNumber,
    clickEvent,
    typeDelay,flush
}
