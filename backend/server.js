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
    "mongodb+srv://devtest01:minsuroh@realter-zwhlg.mongodb.net/test?retryWrites=true&w=majority"
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
    req.body.map(async (item) => {
        let data = new Data(item);
        try {
            await data.save()
        } catch (e) {
            return res.json({ success: false, error: e });
        }
    })
})

app.use(router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));