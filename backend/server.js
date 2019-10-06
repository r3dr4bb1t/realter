const mongoose = require('mongoose');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const Data = require('./data');

const API_PORT = 3001;
const app = express();
app.use(cors());
const router = express.Router();

const dbRoute =
    "mongodb+srv://devtest01:minsuroh@realter-zwhlg.mongodb.net/admin?retryWrites=true&w=majority"
mongoose.connect(dbRoute, { useNewUrlParser: true });

let db = mongoose.connection;

db.once('open', () => console.log('connected to the database'));

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

router.get('/item', (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    });
});

router.post('/item', (req, res) => {
    let data = new Data();

    const [
        articleNo,
        articleName,
        realEstateTypeName,
        tradeTypeName,
        floorInfo,
        dealOrWarrantPrc,
        area1,
        area2,
        articleFeatureDesc,
        cords,
        price,
        numOfRooms
    ] = req.body;

    data.articleNo = articleNo
    data.articleName = articleName
    data.realEstateTypeName = realEstateTypeName
    data.tradeTypeName = tradeTypeName
    data.floorInfo = floorInfo
    data.dealOrWarrantPrc = dealOrWarrantPrc
    data.area1 = area1
    data.area2 = area2
    data.articleFeatureDesc = articleFeatureDesc
    data.cords = cords
    data.price = price
    data.numOfRooms = numOfRooms
    data.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

app.use('/api', router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));