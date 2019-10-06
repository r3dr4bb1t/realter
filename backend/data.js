const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema(
    {
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
    },
    { timestamps: true }
);

module.exports = mongoose.model("Data", DataSchema);