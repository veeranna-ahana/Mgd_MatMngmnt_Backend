const mtrlPartReceiptDetailsRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

mtrlPartReceiptDetailsRouter.get(
  "/getPartReceiptDetailsByRvID",
  async (req, res, next) => {
    try {
      let id = req.query.id;
      //console.log(`SELECT * FROM mtrl_part_receipt_details where RvID = ${id}`);
      misQueryMod(
        `SELECT * FROM mtrl_part_receipt_details where RvID = ${id} order by RvID`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully fetched data from mtrl_part_receipt_details with RvID = ${id}`
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlPartReceiptDetailsRouter.post(
  "/insertPartReceiptDetails",
  async (req, res, next) => {
    try {
      let {
        rvId,
        custBomId,
        unitWeight,
        qtyReceived,
        qtyRejected,
        qtyUsed,
        qtyReturned,
        partId,
        qtyAccepted,
        qtyIssued,
      } = req.body;
      // console.log(
      //   `insert into  mtrl_part_receipt_details (RVID,CustBOM_Id,UnitWt,QtyReceived,QtyRejected,QtyUsed,QtyReturned,PartId,QtyAccepted,QtyIssued) values ("${rvId}","${custBomId}",${unitWeight},"${qtyReceived}","${qtyRejected}","${qtyUsed}","${qtyReturned}","${partId}","${qtyAccepted}","${qtyIssued}")`
      // );
      misQueryMod(
        `insert into  mtrl_part_receipt_details (RVID,CustBOM_Id,UnitWt,QtyReceived,QtyRejected,QtyUsed,QtyReturned,PartId,QtyAccepted,QtyIssued) values ("${rvId}","${custBomId}","${unitWeight}","${qtyReceived}","${qtyRejected}","${qtyUsed}","${qtyReturned}","${partId}","${qtyAccepted}","${qtyIssued}")`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            "successfully inserted data into mtrl_part_receipt_details "
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlPartReceiptDetailsRouter.post(
  "/updatePartReceiptDetails",
  async (req, res, next) => {
    try {
      let {
        id,
        rvId,
        custBomId,
        unitWeight,
        qtyReceived,
        qtyRejected,
        qtyUsed,
        qtyReturned,
        partId,
        qtyAccepted,
        qtyIssued,
      } = req.body;
      // console.log("reqqqq", req.body);
      /*console.log(
        `update mtrl_part_receipt_details set RVId = "${rvId}", CustBOM_Id = "${custBomId}", UnitWt = "${unitWeight}", QtyReceived = "${qtyReceived}", QtyRejected = "${qtyRejected}", QtyUsed = "${qtyUsed}", QtyReturned = "${qtyReturned}", PartId = "${partId}",QtyAccepted = "${qtyAccepted}", QtyIssued = "${qtyIssued}" where id = "${id}"`
      );*/
      misQueryMod(
        `update mtrl_part_receipt_details set CustBOM_Id = '${custBomId}', UnitWt = '${unitWeight}', QtyReceived = "${qtyReceived}", QtyRejected = "${qtyRejected}",PartId = "${partId}",QtyAccepted = "${qtyAccepted}" where id = "${id}"`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully updated mtrl_part_receipt_details for Id=${id}`
          );
          res.json(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlPartReceiptDetailsRouter.post(
  "/deletePartReceiptDetails",
  async (req, res, next) => {
    try {
      let { id } = req.body;
      //console.log(`delete from mtrl_part_receipt_details where id = ${id}`);
      // console.log("delete id", req.body);
      misQueryMod(
        `delete from mtrl_part_receipt_details where Id = ${id}`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully deleted data from mtrl_part_receipt_details of Id=${id}`
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlPartReceiptDetailsRouter.post(
  "/updateQtyReturnedPartReceiptDetails",
  async (req, res, next) => {
    try {
      let { Id, QtyReturned } = req.body;
      misQueryMod(
        `UPDATE magodmis.mtrl_part_receipt_details m SET m.QtyReturned=m.QtyReturned-${QtyReturned} WHERE m.Id=${Id}`,
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

mtrlPartReceiptDetailsRouter.post(
  "/updateQtyReturnedPartReceiptDetails1",
  async (req, res, next) => {
    try {
      let { Id, QtyReturned } = req.body;
      /*console.log(
      );*/
      misQueryMod(
        `UPDATE magodmis.mtrl_part_receipt_details m SET m.QtyReturned=m.QtyReturned+${QtyReturned} WHERE m.Id=${Id}`,
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

mtrlPartReceiptDetailsRouter.post(
  "/updateQtyIssuedPartReceiptDetails",
  async (req, res, next) => {
    try {
      let { Id, Qty } = req.body;
      misQueryMod(
        `UPDATE magodmis.mtrl_part_receipt_details m SET m.QtyIssued=m.QtyIssued-${Qty} WHERE m.Id=${Id}`,
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

mtrlPartReceiptDetailsRouter.post(
  "/updateQtyIssuedPartReceiptDetails1",
  async (req, res, next) => {
    try {
      let { Id, Qty } = req.body;
      misQueryMod(
        `UPDATE magodmis.mtrl_part_receipt_details m SET m.QtyIssued=m.QtyIssued+${Qty} WHERE m.Id=${Id}`,
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

mtrlPartReceiptDetailsRouter.post(
  "/updateQtyIssuedPartReceiptDetails2",
  async (req, res, next) => {
    try {
      let { Id, Qty } = req.body;
      misQueryMod(
        `UPDATE magodmis.mtrl_part_receipt_details m SET m.QtyIssued= 
        CASE WHEN m.QtyIssued<= m.QtyIssued+${Qty} THEN m.QtyIssued+${Qty}
        ELSE m.QtyIssued END WHERE m.Id=${Id}`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully updated mtrl_part_receipt_details for Id=${Id}`
          );
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

module.exports = mtrlPartReceiptDetailsRouter;
