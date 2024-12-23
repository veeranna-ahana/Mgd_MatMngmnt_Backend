const customerRouter = require("express").Router();
var createError = require("http-errors");
const { createFolder, copyallfiles } = require("../../helpers/folderhelper");
const { misQuery, setupQuery, misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { sendDueList } = require("../../helpers/sendmail");
const { logger } = require("../../helpers/logger");

customerRouter.get("/allcustomers", async (req, res, next) => {
  try {
    misQueryMod(
      "Select * from magodmis.cust_data order by Cust_name asc",
      (err, data) => {
        if (err) logger.error(err);
        logger.info("Successfully fetched customer data.");
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

customerRouter.get("/getCustomerByCustCode", async (req, res, next) => {
  let code = req.query.code;
  try {
    misQueryMod(
      `Select * from magodmis.cust_data where Cust_Code = ${code}`,
      (err, data) => {
        // console.log("getCustomerByCustCode", data);
        if (err) logger.error(err);
        logger.info(
          `Successfully fetched from cust_data with Cust_Code = ${code}`
        );
        res.send(data[0]);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = customerRouter;
