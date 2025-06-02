const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');

dotenv.config(); // За користење на .env фајл за конфигурации

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // За работа со JSON податоци

// Базиран URL за API
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);

// Конекција кон MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB конекција успешна!'))
.catch((err) => console.error('Грешка при конекција кон MongoDB:', err));

// Стартување на сервер
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Серверот е стартуван на портата: ${PORT}`);
});

////opcinalno...
app.get('/', (req, res) => {
    res.send("Welcome to API!");
});
