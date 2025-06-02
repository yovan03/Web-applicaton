const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Забранет пристап – потребна е Admin улога.' });
    }
};

module.exports = { adminOnly };
