import mongoose from "mongoose";

const tableScheme = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      unique: true,
    },
    ls: {
      type: String,
      required: true,
    },
    jsn: {
      type: String,
      required: true,
    },
    debtMonth: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    paymentStats: {
      type: Boolean,
      required: true,
    },
    docOpen: {
      type: String,
      required: true,
    },
    stats: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("table", tableScheme);
