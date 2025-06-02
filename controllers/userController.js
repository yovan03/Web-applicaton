const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Генерирање на JWT токен
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Регистрација на нов корисник
const registerUser = async (req, res) => {
    const { firstName, lastName, username, email, password } = req.body;
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    
    try {
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({ message: 'Лозинката мора да има најмалку 8 карактери, вклучувајќи барем една буква и еден број.' });
        }
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Корисник со оваа е-пошта веќе постои.' });
        }

        const user = await User.create({
            firstName,
            lastName,
            username,
            email,
            password,
            role: 'Client',
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Неуспешна регистрација.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Најава на корисник
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user.isBanned) {
            return res.status(403).json({ message: 'Овој корисник е баниран.' });
            }

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id, user.role),
            });
        } else {
            res.status(401).json({ message: 'Невалидна е-пошта или лозинка.' });
        }
         
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Профил на најавен корисник
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: 'Корисникот не е најден.' });
    }
};

const updatePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    // Провера на внесени полиња
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Мора да ги наведете старата и новата лозинка.' });
    }
    try {
      // Наоѓање на корисникот од JWT (req.user.id поставен од authMiddleware)
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'Корисникот не е пронајден.' });
      }
      // Проверка на старата лозинка
      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({ message: 'Старата лозинка не е точна.' });
      }
      // Поставување на нова лозинка
      user.password = newPassword;
      await user.save();
      res.status(200).json({ message: 'Лозинката е успешно променета.' });
    } catch (error) {
      res.status(500).json({ message: 'Грешка при менување на лозинка.', error: error.message });
    }
  };

const deleteUser = async (req, res) => {
    const userId = req.params.id;
    // Проверка дали ид-то од URL соодветствува на идентификаторот од JWT
    if (req.user.id !== userId) {
      return res.status(401).json({ message: 'Не сте овластени за оваа операција.' });
    }
    try {
      // Бришење на корисникот по ID
      await User.findByIdAndDelete(userId);
      res.status(200).json({ message: 'Корисничкиот профил е избришан.' });
    } catch (error) {
      res.status(500).json({ message: 'Грешка при бришење на корисникот.', error: error.message });
    }
  };
  
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Грешка при повлекување на корисниците.', error: error.message });
    }
};

const updateUserRole = async (req, res) => {
    const userId = req.params.id;
    const { role } = req.body;

    if (!['Admin', 'Client'].includes(role)) {
        return res.status(400).json({ message: 'Невалидна улога.' });
    }

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Корисникот не е пронајден.' });
        }

        user.role = role;
        await user.save();
        res.status(200).json({ message: `Улогата е ажурирана на ${role}.` });
    } catch (error) {
        res.status(500).json({ message: 'Грешка при ажурирање на улогата.', error: error.message });
    }
};

const banUser = async (req, res) => {
    const userId = req.params.id;
    const { isBanned } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Корисникот не е пронајден.' });
        }

        user.isBanned = isBanned;
        await user.save();

        const status = isBanned ? 'баниран' : 'одбаниран';
        res.status(200).json({ message: `Корисникот е успешно ${status}.` });
    } catch (error) {
        res.status(500).json({ message: 'Грешка при банирање на корисник.', error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Потребни се е-пошта и нова лозинка.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Корисникот не е пронајден.' });
        }

        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Лозинката е успешно ресетирана.' });
    } catch (error) {
        res.status(500).json({ message: 'Грешка при ресетирање на лозинка.', error: error.message });
    }
};

const searchUsers = async (req, res) => {
    const keyword = req.query.keyword
        ? {
            $or: [
                { firstName: { $regex: req.query.keyword, $options: 'i' } },
                { lastName: { $regex: req.query.keyword, $options: 'i' } },
                { username: { $regex: req.query.keyword, $options: 'i' } },
                { email: { $regex: req.query.keyword, $options: 'i' } },
            ],
        }
        : {};

    try {
        const users = await User.find(keyword).select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Грешка при пребарување на корисници.', error: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updatePassword,
    deleteUser,
    getAllUsers,
    updateUserRole,
    banUser,
    resetPassword,
    searchUsers

};
