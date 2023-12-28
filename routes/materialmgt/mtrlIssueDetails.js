const mtrlIssueDetailsRouter = require("express").Router();
const { misQuery, setupQuery, misQueryMod } = require("../../helpers/dbconn");
const { logger } = require("../../helpers/logger");

mtrlIssueDetailsRouter.post("/insert", async (req, res, next) => {
  try {
    let {
      Iv_Id,
      Srl,
      IV_Date,
      IV_No,
      Cust_Code,
      Customer,
      MtrlDescription,
      Mtrl_Code,
      Material,
      PkngDCNo,
      cust_docu_No,
      RV_No,
      RV_Srl,
      Qty,
      TotalWeightCalculated,
      TotalWeight,
      UpDated,
      RvId,
      Mtrl_Rv_id,
    } = req.body;
    // console.log(
    //   `insert into  mtrlissuedetails (Iv_Id, Srl, IV_Date, IV_No, Cust_Code, Customer, MtrlDescription, Mtrl_Code, Material, PkngDCNo, cust_docu_No, RV_No, RV_Srl, Qty, TotalWeightCalculated, TotalWeight, UpDated, RvId, Mtrl_Rv_id) values ("${Iv_Id}","${Srl}",${IV_Date},"${IV_No}","${Cust_Code}","${Customer}","${MtrlDescription}","${Mtrl_Code}","${Material}","${PkngDCNo}","${cust_docu_No}","${RV_No}","${RV_Srl}","${Qty}","${TotalWeightCalculated}","${TotalWeight}","${UpDated}","${RvId}","${Mtrl_Rv_id}")`
    // );
    await misQueryMod(
      `insert into  mtrlissuedetails (Iv_Id, Srl, IV_Date, IV_No, Cust_Code, Customer, MtrlDescription, Mtrl_Code, Material, PkngDCNo, cust_docu_No, RV_No, RV_Srl, Qty, TotalWeightCalculated, TotalWeight, UpDated, RvId, Mtrl_Rv_id) values ("${Iv_Id}","${Srl}",${IV_Date},"${IV_No}","${Cust_Code}","${Customer}","${MtrlDescription}","${Mtrl_Code}","${Material}","${PkngDCNo}","${cust_docu_No}","${RV_No}","${RV_Srl}","${Qty}","${TotalWeightCalculated}","${TotalWeight}","${UpDated}","${RvId}","${Mtrl_Rv_id}")`,
      (err, data) => {
        if (err) {
          logger.error(err);
          res.send(err);
        }
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlIssueDetailsRouter.get(
  "/getmtrlIssueDetailsByIVID",
  async (req, res, next) => {
    let id = req.query.id;
    try {
      await misQueryMod(
        `Select * from magodmis.mtrlissuedetails where IV_Id = ${id}`,
        (err, data) => {
          // console.log("getmtrlIssueDetailsByIVID", data);
          if (err) logger.error(err);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mtrlIssueDetailsRouter;
