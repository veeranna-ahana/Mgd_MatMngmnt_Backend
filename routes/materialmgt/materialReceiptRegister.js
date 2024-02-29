const materialReceiptRegisterRouter = require("express").Router();
var createError = require("http-errors");
const { createFolder, copyallfiles } = require("../../helpers/folderhelper");
const { misQuery, setupQuery, misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { sendDueList } = require("../../helpers/sendmail");
const { logger } = require("../../helpers/logger");
const { formatDate } = require("../../helpers/utils");

materialReceiptRegisterRouter.get(
  "/getByTypeMaterialReceiptRegister",
  async (req, res, next) => {
    try {
      let type1 = req.query.type1;
      let type2 = req.query.type2;
      if (req.query.type3) {
        //purchase section
        misQueryMod(
          `SELECT * FROM material_receipt_register where RVStatus = '${type1}' and Type = '${type2}' and Cust_Code = 0 order by ReceiptDate DESC`,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      } else {
        misQueryMod(
          `SELECT * FROM material_receipt_register where RVStatus = '${type1}' and Type = '${type2}' order by ReceiptDate DESC `,
          (err, data) => {
            if (err) logger.error(err);
            res.send(data);
          }
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

materialReceiptRegisterRouter.get(
  "/getByTypeMaterialReceiptRegisterByRvID",
  async (req, res, next) => {
    try {
      let id = req.query.id;
      console.log("id", id);
      // console.log(`SELECT * FROM material_receipt_register where RvID = ${id}`);
      misQueryMod(
        `SELECT * FROM material_receipt_register where RvID = ${id} order by RvID`,
        (err, data) => {
          if (err) logger.error(err);

          res.send(data[0]);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

materialReceiptRegisterRouter.post(
  "/insertHeaderMaterialReceiptRegister",
  async (req, res, next) => {
    // console.log(req.body);
    try {
      let {
        receiptDate,
        rvNo,
        rvDate,
        status,
        customer,
        customerName,
        reference,
        weight,
        calcWeight,
        type,
      } = req.body;
      // console.log("req.body", req.body);
      //convert date dd/mm/yyyy to yyyy-mm-dd
      //receiptDate = receiptDate.split("/").reverse().join("-");
      receiptDate = formatDate(new Date(), 5);
      rvDate = rvDate.split("/").reverse().join("-");
      //res.send(req.body);
      misQueryMod(
        `insert into  material_receipt_register (ReceiptDate,RV_No,RV_Date,Cust_Code,Customer,CustDocuNo,RVStatus,TotalWeight,TotalCalculatedWeight,Type) values ("${receiptDate}","${rvNo}","${rvDate}","${customer}","${customerName}","${reference}","${status}","${weight}","${calcWeight}","${type}")`,
        (err, data) => {
          if (err) logger.error(err);
          res.json(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

materialReceiptRegisterRouter.post(
  "/updateHeaderMaterialReceiptRegister",
  async (req, res, next) => {
    console.log("calcWeight", req.body.calcWeight);
    try {
      let {
        rvId,
        receiptDate,
        rvNo,
        rvDate,
        status,
        customer,
        customerName,
        reference,
        weight,
        calcWeight,
        type,
      } = req.body;
      //res.send(req.body);
      // console.log("calcWeight", req.body.calcWeight);
      //convert date dd/mm/yyyy to yyyy-mm-dd
      receiptDate = formatDate(new Date(), 5);
      rvDate = rvDate.split("/").reverse().join("-");
      /*console.log(
        `update material_receipt_register set ReceiptDate = "${receiptDate}",RV_No="${rvNo}",RV_Date="${rvDate}",Cust_Code="${customer}",Customer="${customerName}",CustDocuNo="${reference}",RVStatus="${status}",TotalWeight="${weight}",TotalCalculatedWeight="${calcWeight}" where  RvID = ${rvId}`
      );*/
      misQueryMod(
        `update material_receipt_register set ReceiptDate = "${receiptDate}",RV_No="${rvNo}",RV_Date="${rvDate}",Cust_Code="${customer}",Customer="${customerName}",CustDocuNo="${reference}",RVStatus="${status}",TotalWeight="${weight}",TotalCalculatedWeight="${calcWeight}" where  RvID = ${rvId}`,
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

materialReceiptRegisterRouter.post(
  "/deleteHeaderMaterialReceiptRegisterAndDetails",
  async (req, res, next) => {
    try {
      let { rvId } = req.body;
      misQueryMod(
        `delete from mtrl_part_receipt_details  where  RvID = ${rvId}`,
        (err, data) => {
          if (err) logger.error(err);

          misQueryMod(
            `delete from material_receipt_register  where  RvID = ${rvId}`,
            (err, data) => {
              if (err) logger.error(err);
              res.send(data);
            }
          );
          //res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = materialReceiptRegisterRouter;
