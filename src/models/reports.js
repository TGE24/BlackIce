import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
  {
    district: {
      type: String,
      required: true,
      trim: true
    },
    accidentCause: {
      type: String,
      required: true,
      trim: true
    },
    thumbnail: {
      type: String,
      trim: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

const Report = mongoose.model("report", ReportSchema);

module.exports = Report;
