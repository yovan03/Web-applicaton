const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                console.log('Корисник не е пронајден за ID:', decoded.id);
                return res.status(401).json({ message: 'Корисник не е пронајден.' });
            }
            
            return next();
        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Неовластен пристап, невалиден токен.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Неовластен пристап, нема токен.' });
    }
};

module.exports = { protect };
