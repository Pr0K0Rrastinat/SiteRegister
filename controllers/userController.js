import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/user.js";
import { validationResult } from "express-validator";
import tableModel from "../models/table.js";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "cypher",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    if (!user) {
      return res.status(404).json({
        mesesage: "Пользователь не найден",
      });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash
    );

    if (!isValidPassword) {
      return res.status(404).json({
        message: "Не верный логин или пароль",
      });
    }
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "cypher",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Не удалось авторизоваться",
    });
  }
};


export const tablePost = async (req, res) => {
  try {
    const tab = new tableModel({
      number: req.body.number,
      ls: req.body.ls,
      jsn: req.body.jsn,
      debtMonth: req.body.debtMonth,
      amount: req.body.amount,
      paymentStats: req.body.paymentStats,
      docOpen: req.body.docOpen,
      stats: req.body.stats,
    });

    const saveTable = await tab.save();

    const table = saveTable._tab;
    res.json(table);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Нет доступа",
    });
  }
};

export const getTable = async (req, res) => {
  try {
    const table = await tableModel.find();

    res.json(table);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Failed to fetch table data",
    });
  }
};
