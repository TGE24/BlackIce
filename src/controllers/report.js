import Report from "../models/reports";

exports.postReport = async (req, res, next) => {
  try {
    const { accidentCause, district, thumbnail, content } = req.body;
    const newReport = new Report({
      accidentCause,
      district,
      thumbnail,
      content,
      userId: req.session.user._id
    });
    await newReport.save();
    res.status(200);
    next();
  } catch (error) {
    next(error);
  }
};
