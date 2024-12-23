const shopfloorBOMIssueDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

shopfloorBOMIssueDetailsRouter.post(
  "/insertShopfloorBOMIssueDetails",
  async (req, res, next) => {
    try {
      let {
        IV_ID,
        RV_Id,
        PartReceipt_DetailsID,
        QtyIssued,
        QtyReturned,
        QtyUsed,
      } = req.body;
      // console.log("BOMIssueDetails", req.body);
      misQueryMod(
        `INSERT INTO magodmis.shopfloor_bom_issuedetails
        (IV_ID, RV_Id, PartReceipt_DetailsID, QtyIssued,QtyReturned,QtyUsed) 
        Values(${IV_ID}, ${RV_Id}, ${PartReceipt_DetailsID}, ${QtyIssued}, ${QtyReturned}, ${QtyUsed})`,
        (err, data) => {
          if (err) logger.error(err);
          // console.log("BOMIssueDetails", data);
          logger.info(
            "successfully inserted data into shopfloor_bom_issuedetails"
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

shopfloorBOMIssueDetailsRouter.post(
  "/updateQtyReturnedShopfloorBOMIssueDetails",
  async (req, res, next) => {
    try {
      let { Id } = req.body;
      misQueryMod(
        `UPDATE magodmis.shopfloor_bom_issuedetails s SET s.QtyReturned=s.QtyIssued WHERE s.Id= ${Id}`,
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

module.exports = shopfloorBOMIssueDetailsRouter;
