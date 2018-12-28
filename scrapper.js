const puppeteer = require('puppeteer');

const scrapeData = async (url, username, passowrd) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const nameInput = '#UserName';
  const passInput = '#Password';
  const btnLogin = 'input[type="submit"]';

	await page.goto(url);

  await page.click(nameInput)
  await page.keyboard.type(username)

  await page.click(passInput)
  await page.keyboard.type(passowrd)

  await page.click(btnLogin)
  await page.waitForNavigation();

  const changePageCountToMax = async () => {
    await page.evaluate(() => document.getElementById("pageCount").selectedIndex = 3);
    await page.click('#next');
    await page.waitForSelector('#first');
    await page.click('#first');
  }
  await changePageCountToMax();

  function waitForTournament () {
    return document.querySelector('#body .playersLink').innerHTML != '';
  }

  const waitToLoad = async () => {
    await page.waitForSelector('#body .playersLink');
    await page.waitFor(waitForTournament);
  }
  await waitToLoad();

  const extractData = async () => {
    await page.screenshot({path: 'test.png', fullPage: true});

    const nextPageIsDisabled = await page.evaluate(() => document.querySelector("#next").classList.contains("ui-state-disabled"));

    if (!nextPageIsDisabled) {
      await goToNextPage();
      await extractData();
    } else {
      console.log(`Extracting is done: ${nextPageIsDisabled}`);
    }
  }

  const goToNextPage = async () => {
    await page.click('#next');
    await waitToLoad();
  }

  await extractData();

	await page.close();
};

module.exports.scrapeData = scrapeData;