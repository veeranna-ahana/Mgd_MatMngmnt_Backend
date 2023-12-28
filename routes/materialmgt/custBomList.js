const custBomListRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

custBomListRouter.get("/allCustBomList", async (req, res, next) => {
  try {
    misQueryMod(
      "Select * from magodmis.cust_bomlist order by PartDescription asc",
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = custBomListRouter;
