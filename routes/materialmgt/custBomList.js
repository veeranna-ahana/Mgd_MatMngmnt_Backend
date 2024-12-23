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
        logger.info("successfully fetched cust_bomlist data");
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

custBomListRouter.post("/getCustBomId", async (req, res, next) => {
  const { partId, cust_Code } = req.body;
  console.log("partId", partId);
  try {
    misQueryMod(
      `Select * from magodmis.cust_bomlist where PartId = '${partId}' and Cust_code = '${cust_Code}'`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully fetched custBomId for PartId=${partId} and cust_code=${cust_Code}`
        );

        console.log("Dataaaaaaaaa", data);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = custBomListRouter;
