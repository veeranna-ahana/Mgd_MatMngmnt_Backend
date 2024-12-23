const mtrlDataRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

mtrlDataRouter.get("/allmtrldata", async (req, res, next) => {
  try {
    misQueryMod(
      "Select * from magodmis.mtrl_data order by Mtrl_Code asc",
      (err, data) => {
        if (err) logger.error(err);
        logger.info("successfully fetched data from mtrl_data");
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlDataRouter.get("/getRowByMtrlCode", async (req, res, next) => {
  try {
    let code = req.query.code;
    // console.log("code", code);
    // console.log(
    //   `Select * from magodmis.mtrl_data where Mtrl_Code =  "${code}"`
    // );
    misQueryMod(
      `Select * from magodmis.mtrl_data where Mtrl_Code =  "${code}"`,
      (err, data) => {
        if (err) logger.error(err);
        // console.log("data", data[0]);
        logger.info(
          `successfully fetched data from mtrl_data for Mtrl_Code=${code}`
        );
        res.send(data[0]);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlDataRouter.get("/getGradeID", async (req, res, next) => {
  try {
    let gradeid = req.query.gradeid;
    console.log("gradeid", gradeid);
    // console.log(
    //   `Select * from magodmis.mtrl_data where Mtrl_Code =  "${code}"`
    // );
    misQueryMod(
      `Select Material from magodmis.mtrlgrades where MtrlGradeID =  "${gradeid}"`,
      (err, data) => {
        if (err) logger.error(err);
        // console.log("data", data[0]);
        logger.info(
          `Successfully fetched Material from mtrlgrades for MtrlGradeID=${gradeid}`
        );
        res.send(data[0]);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlDataRouter.get("/getSpecific_Wt", async (req, res, next) => {
  try {
    let code = req.query.code;
    // console.log("code", code);
    // console.log(
    //   `Select * from magodmis.mtrl_data where Mtrl_Code =  "${code}"`
    // );
    misQueryMod(
      `SELECT *
      FROM magodmis.mtrl_data AS md
      INNER JOIN magodmis.mtrlgrades AS mg ON md.MtrlGradeID = mg.MtrlGradeID
      WHERE  md.Mtrl_Code =  "${code}"`,
      (err, data) => {
        if (err) logger.error(err);
        // console.log("data", data[0]);
        logger.info(
          `successfully fetched data from mtrl_data and mtrlgrades with Mtrl_Code=${code}`
        );
        res.send(data[0]);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = mtrlDataRouter;
