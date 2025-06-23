const Search = require('../models/Search');

// Контролер за добивање на сите објекти
const getAllHeritage = async (req, res) => {
    try {
        const heritage = await Search.find({});
        res.status(200).json(heritage);
    } catch (error) {
        res.status(500).json({ message: 'Грешка при повлекување на објектите.', error: error.message });
    }
};

const getAllHeritageByKeyword = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                $or: [
                    { name: { $regex: req.query.keyword, $options: 'i' } },
                    { type: { $regex: req.query.keyword, $options: 'i' } },
                    { location: { $regex: req.query.keyword, $options: 'i' } },
                    { builder: { $regex: req.query.keyword, $options: 'i' } },
                ]
            }
            : {};

        const heritage = await Search.find(keyword);
        res.status(200).json(heritage);
    } catch (error) {
        res.status(500).json({ message: 'Грешка при повлекување на објектите.', error: error.message });
    }
};

// Контролер за добивање на еден објект по ID
const getSingleHeritage = async (req, res) => {
    try {
        const heritage = await Search.findById(req.params.id);
        if (!heritage) {
            return res.status(404).json({ message: 'Објектот не е пронајден.' });
        }
        res.status(200).json(heritage);
    } catch (error) {
        res.status(500).json({ message: 'Грешка при повлекување на објектот.', error: error.message });
    }
};

const createHeritage = async (req, res) => {
    try {
        const { name, type, link, location, built, builder, description, image, latitude, longitude } = req.body;

        const newHeritage = new Search({
            name,
            type,
            link,
            location,
            built,
            builder,
            description,
            image,
            latitude, 
            longitude
        });

        const savedHeritage = await newHeritage.save();
        res.status(201).json(savedHeritage);
    } catch (error) {
        res.status(500).json({ message: 'Грешка при креирање на објектот.', error: error.message });
    }
};

const updateHeritage = async (req, res) => {
    try {
        const updated = await Search.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ message: 'Објектот не е пронајден.' });
        }

        res.status(200).json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Грешка при ажурирање на објектот.', error: error.message });
    }
};

const deleteHeritage = async (req, res) => {
    try {
        const deleted = await Search.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ message: 'Објектот не е пронајден.' });
        }

        res.status(200).json({ message: 'Објектот е успешно избришан.' });
    } catch (error) {
        res.status(500).json({ message: 'Грешка при бришење на објектот.', error: error.message });
    }
};


module.exports = { 
    getAllHeritage, 
    getSingleHeritage,
    getAllHeritageByKeyword,
    createHeritage,
    updateHeritage,
    deleteHeritage
};
