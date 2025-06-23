const mongoose = require('mongoose');

const searchSchema = new mongoose.Schema({
    name: { type: String, required: true },
    link: { type: String , required: false},
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
            'Природен резерват',
            'Тврдина, замок'
        ] 
    },
    location: { type: String, required: true }, // може посебно адреса, град, координати
    built: { type: String },
    builder: { type: String },
    description: { type: String }, // Културно наследство/Знаменитост опис
    image: { type: String }, // URL на слика
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
}, { timestamps: true });

const Search = mongoose.model('Search', searchSchema);

module.exports = Search;
