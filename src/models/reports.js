import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
  {
    injName: {
      type: String,
      required: true,
      trim: true
    },
    userId: {
      type: String,
      required: true
    },
    district: {
      type: String,
      trim: true
    },
    injAddress: {
      type: String,
      trim: true
    },
    injPhone: {
      type: String,
      trim: true
    },
    injDob: {
      type: String,
      trim: true
    },
    injGender: {
      type: String,
      trim: true
    },
    injDetails: {
      type: String,
      trim: true
    },
    injProffession: {
      type: String,
      trim: true
    },
    injType: {
      type: String,
      trim: true
    },
    hospital: {
      type: Boolean
    },
    hosName: {
      type: String,
      trim: true
    },
    hosAddress: {
      type: String
    },
    hosPhone: {
      type: String
    },
    approved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Report = mongoose.model("report", ReportSchema);

module.exports = Report;
