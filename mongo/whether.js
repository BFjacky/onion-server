/*
    个人信息的表格
*/
const db = require('./db.js')
Schema = db.Schema;
let whetherSchema = new Schema(
    {
        city: String,
        cityid: String,
        citycode: String,
        date: String,
        week: String,
        weather: String,
        temp: String,
        temphigh: String,
        templow: String,
        img: String,
        humidity: String,
        pressure: String,
        windspeed: String,
        winddirect: String,
        windpower: String,
        //官方更新时间
        updatetime: String,
        //主机更新时间(用1970年至今的毫秒数来判断)
        changetime:Number,
        index: Object,
        aqi: Object,
        daily: Object,
        hourly: Object,
    }, {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
)
module.exports = db.model('whether', whetherSchema);
/*
        index: [],
        api: {},
        daily: [],
        hourly: [],
*/