const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { 
        type: String, 
        required: true, 
        enum: [
            'Објект/Зграда', 
            'Црква', 
            'Манастир', 
            'Споменик на култура', 
            'Археолошко наоѓалиште', 
            'Споменик на личност',
            'Природна убавина',
            'Национален парк',
            'Природен резерват'
        ] 
    },
    location: { type: String, required: true }, // може посебно адреса, град, координати
    built: { type: String },
    builder: { type: String },
    description: { type: String }, // Културно наследство/Знаменитост опис
    image: { type: String }, // URL на слика
}, { timestamps: true });

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;
