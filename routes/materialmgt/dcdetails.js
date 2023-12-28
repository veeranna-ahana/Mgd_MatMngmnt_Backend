const dcDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

dcDetailsRouter.post("/insert", async (req, res, next) => {
  try {
    let {
      DC_ID,
      DC_Srl,
      Cust_Code,
      cust_docu_No,
      Item_Descrption,
      Material,
      Qty,
      Unit_Wt,
      DC_Srl_Wt,
      Excise_CL_no,
      DespStatus,
    } = req.body;
    // console.log(`Insert Into magodmis.dc_details
    // (DC_ID, DC_Srl, Cust_Code,cust_docu_No, Item_Descrption, Material, Qty,
    // Unit_Wt, DC_Srl_Wt, Excise_CL_no, DespStatus)
    // VALUES("${DC_ID}", "${DC_Srl}", "${Cust_Code}","${cust_docu_No}", "${Item_Descrption}","${Material}", "${Qty}",
    // "${Unit_Wt}", "${DC_Srl_Wt}", ${Excise_CL_no}, "${DespStatus}")`);
    misQueryMod(
      `insert Into magodmis.dc_details
      (DC_ID, DC_Srl, Cust_Code,cust_docu_No, Item_Descrption, Material, Qty,
      Unit_Wt, DC_Srl_Wt, Excise_CL_no, DespStatus) 
      VALUES("${DC_ID}", "${DC_Srl}", "${Cust_Code}","${cust_docu_No}", "${Item_Descrption}","${Material}", "${Qty}", "${Unit_Wt}", "${DC_Srl_Wt}", ${Excise_CL_no}, "${DespStatus}")`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

dcDetailsRouter.get("/getLastInsertID", async (req, res, next) => {
  try {
    misQueryMod(
      "SELECT DC_ID from magodmis.dc_details order by DC_ID DESC limit 1",
      (err, data) => {
        if (err) logger.error(err);
        res.send(data[0]);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = dcDetailsRouter;
