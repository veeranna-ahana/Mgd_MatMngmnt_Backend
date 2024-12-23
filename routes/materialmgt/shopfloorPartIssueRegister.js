const shopfloorPartIssueRegisterRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

shopfloorPartIssueRegisterRouter.post(
  "/updateStatusShopfloorPartIssueRegister",
  async (req, res, next) => {
    try {
      let { Id, status } = req.body;
      misQueryMod(
        `UPDATE magodmis.shopfloor_part_issueregister s SET s.Status='${status}' WHERE s.IssueID= ${Id}`,
        (err, data) => {
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

shopfloorPartIssueRegisterRouter.post(
  "/insertShopfloorPartIssueRegister",
  async (req, res, next) => {
    try {
      let {
        IV_No,
        Issue_date,
        NC_ProgramNo,
        QtyIssued,
        QtyReturned,
        QtyUsed,
        Ncid,
      } = req.body;

      // console.log("register", req.body);
      misQueryMod(
        `INSERT INTO magodmis.shopfloor_part_issueregister
          (IV_No, Issue_date, NC_ProgramNo, QtyIssued,QtyReturned,QtyUsed,Ncid) Values
          (${IV_No}, "${Issue_date}", ${NC_ProgramNo}, ${QtyIssued},${QtyReturned},${QtyUsed},${Ncid})`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            "successfully inserted data into shopfloor_part_issueregister"
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = shopfloorPartIssueRegisterRouter;
