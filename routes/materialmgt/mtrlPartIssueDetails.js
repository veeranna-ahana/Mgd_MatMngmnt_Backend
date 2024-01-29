const mtrlPartIssueDetailsRouter = require("express").Router();
const { misQuery, setupQuery, misQueryMod } = require("../../helpers/dbconn");
const { logger } = require("../../helpers/logger");

mtrlPartIssueDetailsRouter.post("/insert", async (req, res, next) => {
  try {
    let {
      Iv_Id,
      Srl,
      Cust_Code,
      RVId,
      Mtrl_Rv_id,
      PartId,
      CustBOM_Id,
      UnitWt,
      TotalWeight,
      QtyReturned,
      Remarks,
    } = req.body;
    // console.log();
    misQueryMod(
      `insert into magodmis.mtrl_part_issue_details (Iv_Id, Srl, Cust_Code, RVId, Mtrl_Rv_id, PartId, CustBOM_Id, UnitWt, TotalWeight, QtyReturned, Remarks) 
        values ("${Iv_Id}","${Srl}","${Cust_Code}","${RVId}","${Mtrl_Rv_id}","${PartId}","${CustBOM_Id}","${UnitWt}","${TotalWeight}","${QtyReturned}","${Remarks}")`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlPartIssueDetailsRouter.get(
  "/getmtrlPartIssueDetailsByIVID",
  async (req, res, next) => {
    let id = req.query.id;
    // console.log(
    //   `Select * from magodmis.mtrl_part_issue_details where Iv_Id = ${id}`
    // );
    try {
      await misQueryMod(
        `Select * from magodmis.mtrl_part_issue_details where Iv_Id = ${id}`,
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

module.exports = mtrlPartIssueDetailsRouter;
