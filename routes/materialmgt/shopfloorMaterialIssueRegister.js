const shopfloorMaterialIssueRegisterRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

shopfloorMaterialIssueRegisterRouter.post(
  "/insertShopfloorMaterialIssueRegister",
  async (req, res, next) => {
    try {
      let { IV_No, Issue_date, NC_ProgramNo, QtyIssued, QtyReturned, Ncid } =
        req.body;
      misQueryMod(
        `INSERT INTO magodmis.shopfloor_material_issueregister
                (IV_No, Issue_date, NC_ProgramNo, QtyIssued,QtyReturned,Ncid, Issue_time) Values
                (${IV_No}, "${Issue_date}", ${NC_ProgramNo}, ${QtyIssued},${QtyReturned},${Ncid}, CURTIME())`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            "successfully inserted data into shopfloor_material_issueregister"
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

shopfloorMaterialIssueRegisterRouter.post(
  "/updateShopfloorMaterialIssueRegisterQtyReturnedAddOne",
  async (req, res, next) => {
    try {
      let { id } = req.body;
      misQueryMod(
        `UPDATE magodmis.shopfloor_material_issueregister s 
        SET s.QtyReturned= s.QtyReturned+1 
        WHERE s.IssueID = ${id}`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully updated shopfloor_material_issueregister with IssueID=${id}`
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = shopfloorMaterialIssueRegisterRouter;
