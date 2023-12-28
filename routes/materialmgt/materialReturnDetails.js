const materialReturnDetailsRouter = require("express").Router();
const { misQuery, setupQuery, misQueryMod } = require("../../helpers/dbconn");
const { logger } = require("../../helpers/logger");

materialReturnDetailsRouter.post("/insert", async (req, res, next) => {
  try {
    let { DelDate, IV_NO } = req.body;

    misQueryMod(
      `INSERT INTO magodmis.materialreturneddetails SELECT *, "${DelDate}" From magodmis.mtrlstocklist where IV_NO ="${IV_NO}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

materialReturnDetailsRouter.post("/deleteByIVNO", async (req, res, next) => {
  try {
    let { IV_NO } = req.body;

    misQueryMod(
      `DELETE FROM magodmis.materialreturneddetails where IV_NO ="${IV_NO}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = materialReturnDetailsRouter;
