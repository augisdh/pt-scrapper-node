const puppeteer = require('puppeteer');
const fs = require('fs');

const scrapeData = async (url, username, passowrd) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const nameInput = '#UserName';
  const passInput = '#Password';
  const btnLogin = 'input[type="submit"]';
  const allData = [];

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
    const pageData = await page.evaluate(() => {
      const selector = document.querySelectorAll("tbody#body tr");
      const dataArr = Array.from(selector);
      const dataDate = dataArr.map((date) => date.children[0].innerText);
      const dataTournament = dataArr.map((tournament) => tournament.children[1].children[0].innerText);
      const dataBuyin = dataArr.map((buyin) => buyin.children[2].innerText);
      const dataPrize = dataArr.map((prize) => prize.children[4].innerText);

      for (let i = 0; i < dataArr.length; i++) {
        dataArr[i].date = dataDate[i]
        dataArr[i].tournament = dataTournament[i];
        dataArr[i].buyin = dataBuyin[i];
        dataArr[i].prize = dataPrize[i];
      }
      return dataArr;
    })

    await pushData(pageData)

    const nextPageIsDisabled = await page.evaluate(() => document.querySelector("#next").classList.contains("ui-state-disabled"));

    if (!nextPageIsDisabled) {
      await goToNextPage();
      await extractData();
    } else {
      const dataJSON = JSON.stringify(allData, null, 2);
      fs.writeFile('data.json', dataJSON, (err) => {
        (err) ? console.log(`Something wrong: ${err}`) : console.log('Everything works!');
      });
    }
  }

  const pushData = async (arr) => {
    function checkValue (obj, key, value) {
      return obj.hasOwnProperty(key) && obj[key] === value;
    }

    arr.forEach(game => {
      if (allData.length !== 0) {
        let hasValue = allData.some(item => {return checkValue(item, 'tournament', game.tournament)});
        if (hasValue) {
          let indexToPush = allData.findIndex(i => i.tournament === game.tournament);
          allData[indexToPush]['list'].push(game);
        } else {
          allData[allData.length] = Object.assign({tournament: game.tournament, list: new Array(game)});
        }
      } else {
        allData[0] = Object.assign({tournament: game.tournament, list: new Array(game)});
      }
    });
  }

  const goToNextPage = async () => {
    await page.click('#next');
    await waitToLoad();
  }

  await extractData();

	await page.close();
};

module.exports.scrapeData = scrapeData;