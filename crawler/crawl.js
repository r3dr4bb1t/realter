const puppeteer = require('puppeteer');
const fs = require('fs');
const _ = require("lodash")
const axios = require("axios")

const GWANAK_GU_CORD_URLs = [
    `https://new.land.naver.com/api/articles?cortarNo=1162010100&order=rank&realEstateType=DDDGG&tradeType=&tag=%3A%3A%3A%3A%3A%3A%3A%3A&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=false&minMaintenanceCost&maxMaintenanceCost&priceType=RETAIL&directions=&page=`,
    `https://new.land.naver.com/api/articles?cortarNo=1162010200&order=rank&realEstateType=DDDGG&tradeType=&tag=%3A%3A%3A%3A%3A%3A%3A%3A&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=false&minMaintenanceCost&maxMaintenanceCost&priceType=RETAIL&directions=&page=`,
    `https://new.land.naver.com/api/articles?cortarNo=1162010300&order=rank&realEstateType=DDDGG&tradeType=&tag=%3A%3A%3A%3A%3A%3A%3A%3A&rentPriceMin=0&rentPriceMax=900000000&priceMin=0&priceMax=900000000&areaMin=0&areaMax=900000000&oldBuildYears&recentlyBuildYears&minHouseHoldCount&maxHouseHoldCount&showArticle=false&sameAddressGroup=false&minMaintenanceCost&maxMaintenanceCost&priceType=RETAIL&directions=&page=`
]

let isMoreData = true

const ITEM_INFO_URLs = `https://new.land.naver.com/houses?articleNo=`

async function crawl() {
    const browser = await puppeteer.launch()
    for (const dong of GWANAK_GU_CORD_URLs) {
        pageNo = 1
        while (isMoreData) {
            let realEstatesMetaData
            const page = await browser.newPage()
            page.on('response', async response => {
                realEstatesMetaData = JSON.parse((await response.buffer()).toString())
                isMoreData = realEstatesMetaData.isMoreData
            })
            await page.goto(`${dong}${pageNo++}&articleState`, { waitUntil: 'networkidle0' });
            const basicRealEstatesInfo = getPayload(realEstatesMetaData)
            const extraRealEstateInfo = await Promise.all(
                basicRealEstatesInfo.map(async (realEstate) => {
                    const [price, numOfRooms] = await getExtraRealEstateInfo(browser, realEstate.articleNo)
                    return {
                        articleNo: realEstate.articleNo,
                        price,
                        numOfRooms
                    }
                })
            )
            const realEstates = addExtraInfo(basicRealEstatesInfo, extraRealEstateInfo)
            axios.post('http://localhost:3000/api/item',
                realEstates
            );
            if (!fs.existsSync("./tmp/rows.json"))
                fs.mkdirSync("./tmp")
            fs.appendFileSync("./tmp/rows.json", JSON.stringify(...realEstates))
            isMoreData = true
        }
        await browser.close()
    };
}

async function getExtraRealEstateInfo(browser, articleNo) {
    const page = await browser.newPage();
    await page.goto(`${ITEM_INFO_URLs}${articleNo}`);
    const roomInfo = await page.$x("//th[contains(text(), '방수/욕실수')]")
    let numOfRooms
    try {
        numOfRooms = await page.evaluate(room => room.nextSibling.innerHTML, roomInfo[0]);
    } catch (e) { }

    const price = await page.evaluate(() => {
        let data = [];
        let elements = document.getElementsByClassName('price');
        for (const element of elements)
            data.push(element.textContent);
        return data[0];
    })

    await page.close()
    return [price, numOfRooms]
}

function getPayload(realEstatesMetaData) {
    const realEstatesData = []
    for (const realEstateMetaData of realEstatesMetaData.articleList) {
        realEstatesData.push({
            articleNo: realEstateMetaData.articleNo,
            articleName: realEstateMetaData.articleName,
            realEstateTypeName: realEstateMetaData.realEstateTypeName,
            tradeTypeName: realEstateMetaData.tradeTypeName,
            floorInfo: realEstateMetaData.floorInfo,
            dealOrWarrantPrc: realEstateMetaData.dealOrWarrantPrc,
            area1: realEstateMetaData.area1,
            area2: realEstateMetaData.area2,
            articleFeatureDesc: realEstateMetaData.articleFeatureDesc,
            cords: [realEstateMetaData.latitude, realEstateMetaData.longitude]
        })
    }
    return realEstatesData
}

function addExtraInfo(basicRealEstatesInfo, extraRealEstateInfo) {
    return _.merge(basicRealEstatesInfo, extraRealEstateInfo);
}

crawl()
