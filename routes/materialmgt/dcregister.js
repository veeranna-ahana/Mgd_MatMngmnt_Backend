const dcRegisterRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

dcRegisterRouter.post("/insert", async (req, res, next) => {
  try {
    let {
      DC_Type,
      DC_No,
      DC_Date,
      Cust_Code,
      Cust_Name,
      Cust_Address,
      Cust_Place,
      Cust_State,
      PIN_Code,
      GSTNo,
      ECC_No,
      TIN_No,
      CST_No,
      AuhtorisingDocu,
      Total_Wt,
      ScarpWt,
      DCStatus,
      Remarks,
    } = req.body;
    misQueryMod(
      `INSERT INTO magodmis.dc_register (DC_Type,DC_No,DC_Date,Cust_Code, Cust_Name, Cust_Address,Cust_Place, Cust_State, PIN_Code,
                GSTNo, ECC_No, TIN_No, CST_No,AuhtorisingDocu,Total_Wt, ScarpWt, DCStatus, Remarks)
                VALUES("${DC_Type}","${DC_No}","${DC_Date}","${Cust_Code}","${Cust_Name}","${Cust_Address}","${Cust_Place}",
                "${Cust_State}","${PIN_Code}","${GSTNo}","${ECC_No}","${TIN_No}","${CST_No}","${AuhtorisingDocu}","${Total_Wt}","${ScarpWt}","${DCStatus}","${Remarks}")`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

dcRegisterRouter.get("/getDCRegisterByID", async (req, res, next) => {
  let id = req.query.id;
  try {
    misQueryMod(
      `Select * from magodmis.dc_register where DC_Id = ${id}`,
      (err, data) => {
        if (err) logger.error(err);
        data.length != 0 ? res.send(data[0]) : res.send([]);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = dcRegisterRouter;
