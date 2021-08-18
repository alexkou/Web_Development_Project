const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HeatMapSchema = new Schema ({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },

    ip: String,

    lat: Number,

    lon: Number,

    intensity: Number
});

module.exports = mongoose.model("Heatmap", HeatMapSchema);