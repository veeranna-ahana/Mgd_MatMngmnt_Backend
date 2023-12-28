const shopFloorAllotmentRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

shopFloorAllotmentRouter.get(
  "/getShopFloorAllotmentPartFirstTable",
  async (req, res, next) => {
    try {
      let id = req.query.id;
      misQueryMod(
        `SELECT c1.id,c2.PartId,c1.Quantity as QtyPerAssy, c2.Id As CustBOM_Id,
          n.Sheets*c1.Quantity as QtyRequired, n.NC_Pgme_Part_ID, n.QtyRejected
          FROM magodmis.ncprogram_partslist n,magodmis.task_partslist t,magodmis.orderscheduledetails o,magodmis.cust_assy_data c,
          magodmis.cust_assy_bom_list c1,magodmis.cust_bomlist c2 
          WHERE  n.Ncid=${id} AND n.Task_Part_Id=t.Task_Part_Id and t.SchDetailsId=o.SchDetailsID
          AND c.MagodCode = o.Dwg_Code AND c1.Cust_AssyId=c.Id AND c1.Cust_BOM_ListId=c2.Id`,
        (err, data) => {
          if (err) logger.error(err);
          //console.log("data received");
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

shopFloorAllotmentRouter.get(
  "/getShopFloorAllotmentPartFirstTableQtyAvl",
  async (req, res, next) => {
    try {
      let id = req.query.id;
      misQueryMod(
        `SELECT  Sum(m.QtyAccepted- m.QtyIssued - m.QtyReturned)  as QtyAvialable
          FROM magodmis.mtrl_part_receipt_details m,magodmis.material_receipt_register m1 
          WHERE m.CustBOM_Id = ${id} AND m.RvID=m1.RvID AND m1.RVStatus='Received' 
          AND m.QtyAccepted >  m.QtyIssued + m.QtyReturned;
          `,
        (err, data) => {
          res.send(data);
          if (err) logger.error(err);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

shopFloorAllotmentRouter.get(
  "/getShopFloorAllotmentPartSecondTableIds",
  async (req, res, next) => {
    try {
      let bomids = req.query.bomids;
      console.log("ids = ", bomids);
      misQueryMod(
        `SELECT m.*, m1.RV_No, m1.RV_Date 
        FROM magodmis.mtrl_part_receipt_details m,magodmis.material_receipt_register m1 
        WHERE m.CustBOM_Id in (${bomids}) AND m1.RvID=m.RVId AND m1.RVStatus='Received'
        AND m.QtyAccepted >  m.QtyIssued + m.QtyReturned order by CustBOM_Id, m1.RV_Date `,
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

module.exports = shopFloorAllotmentRouter;
