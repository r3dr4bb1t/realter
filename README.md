# :sparkles: Crawler for Real Estate Items in Naver 

![React](https://img.shields.io/badge/React-v16.9.0-9cf)

## :wrench: Usage

* Local  
```shell
yarn start  
```
* Crawl
```shell
yarn crawl
```
*It sends data to mongodb connected to app for every page. TO_DO: caching

## :checkered_flag: APIs 

* GET /api/item
* POST /api/item
 parameters: {  
        articleNo: String,  
        articleName: String,  
        realEstateTypeName: String,  
        tradeTypeName: String,  
        floorInfo: String,  
        dealOrWarrantPrc: String,  
        area1: Number,  
        area2: Number,  
        articleFeatureDesc: String,  
        cords: [String, String],  
        price: String,  
        numOfRooms: String  
 }



