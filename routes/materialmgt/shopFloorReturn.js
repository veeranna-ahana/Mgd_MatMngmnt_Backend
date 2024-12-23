const shopFloorReturnRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");
const { log } = require("winston");

shopFloorReturnRouter.get("/getFirstMainTable", async (req, res, next) => {
  try {
    let status = req.query.status;
    misQueryMod(
      // `SELECT s.*, n.Machine, n.shape, n.mtrl_code,c.cust_name FROM magodmis.shopfloor_material_issueregister s,
      //   magodmis.ncprograms n,magodmis.cust_data c
      //   WHERE n.NcId=s.NcId And s.QtyReturned <= s.QtyIssued
      //   AND s.Status not like 'Closed' AND n.Machine is not null AND  c.cust_code=n.Cust_code AND YEAR(s.Issue_date) >= YEAR(CURRENT_DATE()) - 1
      //   AND YEAR(s.Issue_date) <= YEAR(CURRENT_DATE()) ORDER BY s.Issue_date desc`,
      `SELECT s.*, n.Machine, n.shape, n.mtrl_code,c.cust_name FROM magodmis.shopfloor_material_issueregister s,
      magodmis.ncprograms n,magodmis.cust_data c
      WHERE n.NcId=s.NcId And s.QtyReturned <= s.QtyIssued
      AND s.Status not like 'Closed' AND n.Machine is not null AND  c.cust_code=n.Cust_code ORDER BY s.Issue_date desc`,

      (err, data) => {
        if (err) logger.error(err);
        logger.info("successfully fetched table data");
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

shopFloorReturnRouter.get("/getSecondMainTable", async (req, res, next) => {
  try {
    let id = req.query.id;
    // console.log("id", id);
    misQueryMod(
      `SELECT * FROM magodmis.ncprogrammtrlallotmentlist n WHERE n.IssueID=${id}
      AND (n.Used Or n.Rejected) And Not n.returntostock`,

      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          "successfully fetched data from ncprogrammtrlallotmentlist"
        );
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});
module.exports = shopFloorReturnRouter;
