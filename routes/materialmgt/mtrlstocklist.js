const mtrlStockListRouter = require("express").Router();
const { misQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");
const { log } = require("winston");

mtrlStockListRouter.get("/checkStockAvailable", async (req, res, next) => {
  try {
    let rvno = req.query.rvno;
    misQueryMod(
      `Select * from magodmis.mtrlstocklist where RV_No =  "${rvno}"`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully fetched data from mtrlstocklist with RV_No="${rvno}"`
        );
        res.send(data);
      }
    );
    //res.send(false);
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/insertMtrlStockList", async (req, res, next) => {
  try {
    let {
      mtrlStockId,
      mtrlRvId,
      custCode,
      customer,
      rvNo,
      custDocuNo,
      mtrlCode,
      shape,
      shapeID,
      material,
      dynamicPara1,
      dynamicPara2,
      dynamicPara3,
      dynamicPara4,
      locked,
      scrap,
      issue,
      weight,
      scrapWeight,
      ivNo,
      ncProgramNo,
      locationNo,
      srl,
      accepted,
    } = req.body;

    // console.log("accepted", req.body.accepted);
    // console.log("Alll", req.body);

    let returnData = null;
    //find shape
    misQueryMod(
      `select * from shapes where ShapeID = ${shapeID}`,
      (err, data) => {
        if (err) {
          logger.error(err);

          return;
        }
        logger.info(
          `successfully fetched data from shapes with ShapeID=${shapeID}`
        );
        if (data && data.length > 0 && data[0].Shape) {
          shape = data[0].Shape;
          for (let i = 0; i < accepted; i++) {
            mtrlStockId = rvNo + "/" + srl + "/" + (i + 1);
            misQueryMod(
              `insert into  mtrlstocklist (MtrlStockID,Mtrl_Rv_id,Cust_Code,Customer,RV_No,Cust_Docu_No,Mtrl_Code,Shape,Material,DynamicPara1,DynamicPara2,DynamicPara3,DynamicPara4,Locked,Scrap,Issue,Weight,ScrapWeight,IV_No,NCProgramNo,LocationNo) values ("${mtrlStockId}",${mtrlRvId},"${custCode}","${customer}","${rvNo}","${custDocuNo}","${mtrlCode}","${shape}","${material}",${dynamicPara1},${dynamicPara2},${dynamicPara3},${dynamicPara4},${locked},${scrap},${issue},${weight},${scrapWeight},"${ivNo}","${ncProgramNo}","${locationNo}")`,
              (err, data1) => {
                if (err) logger.error(err);
                logger.info("successfully inserted data into mtrlstocklist");
                //returnData = data1;
                //res.send(data);
              }
            );
          }
        }
      }
    );
    //console.log("returnData = ", returnData);
    res.send({ affectedRows: 1 });
    /*console.log(
      `insert into  mtrlstocklist (MtrlStockID,Mtrl_Rv_id,Cust_Code,Customer,RV_No,Cust_Docu_No,Mtrl_Code,Shape,Material,DynamicPara1,DynamicPara2,DynamicPara3,DynamicPara4,Locked,Scrap,Issue,Weight,ScrapWeight,IV_No,NCProgramNo,LocationNo) values ("${mtrlStockId}",${mtrlRvId},"${custCode}","${customer}","${rvNo}","${custDocuNo}","${mtrlCode}","${shape}","${material}",${dynamicPara1},${dynamicPara2},${dynamicPara3},${dynamicPara4},${locked},${scrap},${issue},${weight},${scrapWeight},"${ivNo}","${ncProgramNo}","${locationNo}")`
    );*/
  } catch (error) {
    next(error);
  }
});

// mtrlStockListRouter.post("/deleteMtrlStockByRVNo", async (req, res, next) => {
//   try {
//     const { Mtrl_Rv_id } = req.body;

//     let countResult, inUseResult, deletionResult;

//     // Query to check count of material stock
//     misQueryMod(
//       `SELECT COUNT(*) AS count FROM magodmis.mtrlstocklist m WHERE m.Mtrl_Rv_id = '${Mtrl_Rv_id}'`,
//       (err, result) => {
//         if (err) {
//           logger.error(err);
//           return res.send(err);
//         }
//         countResult = result;

//         // Query to check if material is in use for production
//         misQueryMod(
//           `SELECT COUNT(*) AS inUseCount FROM magodmis.mtrlstocklist WHERE Mtrl_Rv_id = '${Mtrl_Rv_id}' AND (Locked OR Scrap OR Issue)`,
//           (err, result) => {
//             if (err) {
//               logger.error(err);
//               return res.send(err);
//             }
//             inUseResult = result;

//             // Query to delete material stock
//             misQueryMod(
//               `DELETE FROM magodmis.MtrlStockList WHERE Mtrl_Rv_id = '${Mtrl_Rv_id}'`,
//               (err, result) => {
//                 if (err) {
//                   logger.error(err);
//                   return res.send(err);
//                 }
//                 deletionResult = result;
//                 // console.log("Deletion Result:", deletionResult);

//                 // Send combined response
//                 const combinedResult = {
//                   countResult: countResult,
//                   inUseResult: inUseResult,
//                   deletionResult: deletionResult,
//                 };
//                 return res.send(combinedResult);
//               }
//             );
//           }
//         );
//       }
//     );
//   } catch (error) {
//     logger.error(error);
//     return res.send(error);
//   }
// });

mtrlStockListRouter.post("/deleteMtrlStockByRVNo", async (req, res, next) => {
  try {
    const { Mtrl_Rv_id, Mtrl_Code, Accepted } = req.body;

    let countResult, inUseResult, deletionResult;

    // Query to check count of material stock
    misQueryMod(
      `SELECT COUNT(*) AS count FROM magodmis.mtrlstocklist m WHERE m.Mtrl_Rv_id = '${Mtrl_Rv_id}'`,
      (err, result) => {
        if (err) {
          logger.error(err);
          return res.send(err);
        }
        logger.info(
          `successfully fetched count from mtrlstocklist for Mtrl_Rv_id = '${Mtrl_Rv_id}'`
        );
        countResult = result;

        // Query to check if material is in use for production
        misQueryMod(
          `SELECT COUNT(*) AS inUseCount FROM magodmis.mtrlstocklist WHERE Mtrl_Rv_id = '${Mtrl_Rv_id}' AND (Locked OR Scrap OR Issue)`,
          (err, result) => {
            if (err) {
              logger.error(err);

              return res.send(err);
            }
            logger.info(
              `successfully fetched inUseCount from mtrlstocklist for Mtrl_Rv_id = '${Mtrl_Rv_id}'`
            );
            inUseResult = result;

            // Check conditions similar to React code
            if (countResult[0].count < parseFloat(Accepted)) {
              return res.send({
                error:
                  "Received Material Already used, to return create a Issue Voucher",
              });
            } else if (inUseResult[0].inUseCount > 0) {
              return res.send({
                error:
                  "Material already in use for production, cannot take out from stock",
              });
            } else {
              // Query to delete material stock
              misQueryMod(
                `DELETE FROM magodmis.MtrlStockList WHERE Mtrl_Rv_id = '${Mtrl_Rv_id}'`,
                (err, result) => {
                  if (err) {
                    logger.error(err);

                    return res.send(err);
                  }
                  logger.info(
                    `successfully deleted data from MtrlStockList with Mtrl_Rv_id = '${Mtrl_Rv_id}'`
                  );
                  deletionResult = result;

                  // Send combined response
                  const combinedResult = {
                    countResult: countResult,
                    inUseResult: inUseResult,
                    deletionResult: deletionResult,
                  };
                  return res.send(combinedResult);
                }
              );
            }
          }
        );
      }
    );
  } catch (error) {
    logger.error(error);
    return res.send(error);
  }
});

mtrlStockListRouter.post("/updateAfterRemoveStock", (req, res, next) => {
  try {
    const { rvId, custCode } = req.body;
    // console.log("RvId CustCode", req.body);

    if (custCode === "0000") {
      misQueryMod(
        `DELETE FROM magodmis.magod_material_sales_register WHERE RvID = '${rvId}'`,
        (deleteErr, deleteData) => {
          if (deleteErr) {
            logger.error(deleteErr);
            // return next(deleteErr);
          }
          logger.info(
            `successfully deleted data from magod_material_sales_register with RvID = '${rvId}'`
          );

          const insertQuery1 = `INSERT INTO magodmis.magod_Material_Sales_Register(Cust_Code, Cust_Name, MDate, Mtrl_Type, Weight, Rv_No, RvID, Cust_Dc_No, txnType)
              SELECT  m.Cust_Code, m.Customer, m.RV_Date, m.Material, ROUND(SUM(m.TotalWeightCalculated), 2) as tw, m.Rv_no, m.RvID, m.Cust_Docu_No, 'Receive'
              FROM magodmis.mtrlreceiptdetails m
            WHERE m.Rvid = '${rvId}' AND m.UpDated
            GROUP BY m.Cust_Code, m.Customer, m.RV_Date, m.Material, m.Rv_no, m.RvID, m.Cust_Docu_No`;

          misQueryMod(insertQuery1, (insertErr, insertData) => {
            if (insertErr) {
              logger.error(insertErr);

              return next(insertErr);
            }
            logger.info(
              "successfully inserted data into magod_Material_Sales_Register"
            );
            // console.log("insertedData1", insertData);
            res.send(insertData);
          });
        }
      );
    } else {
      misQueryMod(
        `DELETE FROM magodmis.customer_material_return_register WHERE RvID = '${rvId}'`,
        (deleteErr, deleteData) => {
          if (deleteErr) {
            logger.error(deleteErr);
            return next(deleteErr);
          }

          logger.info(
            `successfully deleted data from customer_material_return_register with RvID = '${rvId}'`
          );

          const insertQuery2 = `INSERT INTO magodmis.customer_material_return_register(Cust_Code, Cust_Name, MDate, Mtrl_Type, Weight, Rv_No, RvID, Cust_Dc_No, txnType)
            SELECT  m.Cust_Code, m.Customer, m.RV_Date, m.Material, ROUND(SUM(m.TotalWeightCalculated), 2) as tw, m.Rv_no, m.RvID, m.Cust_Docu_No, 'Receive'
            FROM magodmis.mtrlreceiptdetails m
            WHERE m.Rvid = '${rvId}' AND m.UpDated GROUP BY m.Cust_Code, m.Customer, m.RV_Date, m.Material, m.Rv_no, m.RvID, m.Cust_Docu_No`;

          misQueryMod(insertQuery2, (insertErr, insertData) => {
            if (insertErr) {
              logger.error(insertErr);
              return next(insertErr);
            }
            logger.info(
              "successfully inserted data into customer_material_return_register"
            );
            // console.log("insertedData2", insertData);
            res.send(insertData);
          });
        }
      );
    }
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/deleteMtrlStockByIVNo", async (req, res, next) => {
  try {
    let { IV_No } = req.body;
    misQueryMod(
      `delete from magodmis.mtrlstocklist where IV_No =  "${IV_No}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateIssueIVNo", async (req, res, next) => {
  try {
    let { Issue, Iv_No, MtrlStockID } = req.body;
    // console.log(
    //   `update magodmis.mtrlstocklist set Issue="${Issue}", Iv_No = "${Iv_No}" where MtrlStockID =  "${MtrlStockID}"`
    // );
    misQueryMod(
      `update magodmis.mtrlstocklist set Issue="${Issue}", Iv_No = "${Iv_No}" where MtrlStockID =  "${MtrlStockID}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateIVNoNULL", async (req, res, next) => {
  try {
    let { IV_No } = req.body;

    misQueryMod(
      `update magodmis.mtrlstocklist set Iv_No= null where Iv_No = "${IV_No}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateMtrlStockLock", async (req, res, next) => {
  try {
    let { id } = req.body;
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist SET Locked=1 WHERE MtrlStockID='${id}'`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully updated mtrlstocklist for MtrlStockID='${id}'`
        );
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateMtrlStockLock1", async (req, res, next) => {
  try {
    let { DynamicPara1, DynamicPara2, LocationNo, Weight, MtrlStockID } =
      req.body;
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist m 
      SET  m.Locked=0, m.DynamicPara1=${DynamicPara1},
      m.DynamicPara2=${DynamicPara2}, m.LocationNo ='${LocationNo}', m.Weight =${Weight} 
      WHERE m.MtrlStockID='${MtrlStockID}'`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully updated mtrlstocklist for MtrlStockID='${MtrlStockID}'`
        );
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateMtrlStockLock2", async (req, res, next) => {
  try {
    let { ScrapWeight, LocationNo, MtrlStockID } = req.body;
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist m 
      SET m.DynamicPara1=0,m.DynamicPara2=0,m.Weight=0, m.Scrap=-1, 
      m.Locked=-1,m.ScrapWeight=${ScrapWeight}, m.LocationNo ='${LocationNo}' 
      WHERE m.MtrlStockID='${MtrlStockID}'`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully updated mtrlstocklist for MtrlStockID='${MtrlStockID}'`
        );
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/updateMtrlStockLock3", async (req, res, next) => {
  // console.log("upate data..........", req.body);
  try {
    // let { LocationNo, MtrlStockID } = req.body;
    misQueryMod(
      `UPDATE magodmis.mtrlstocklist
          SET
              DynamicPara1 = '0.00',
              DynamicPara2 = '0.00',
              Scrap = -1,
              Locked = -1,
              Weight = '0.000',
              ScrapWeight = '0.000',
              LocationNo = '${req.body.LocationNo}'
          WHERE
              MtrlStockID = '${req.body.MtrlStockID}'`,

      // DynamicPara1 = 0,
      // DynamicPara2 = 0,
      // Weight = 0,
      // left.......................... for upadte....

      // `UPDATE magodmis.mtrlstocklist m
      // SET m.DynamicPara1=0,m.DynamicPara2=0,m.Weight=0, m.Scrap=-1,
      // m.Locked=-1, m.LocationNo ='${LocationNo}'
      // WHERE m.MtrlStockID='${MtrlStockID}'`,
      (err, data) => {
        if (err) logger.error(err);
        logger.info(
          `successfully updated mtrlstocklist for MtrlStockID = '${req.body.MtrlStockID}'`
        );
        // console.log("response", data);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/insertByReturnDetails", async (req, res, next) => {
  try {
    let { Iv_Id, IV_No } = req.body;
    misQueryMod(
      `INSERT INTO  mtrlstocklist(MtrlStockID, Mtrl_Rv_id, Cust_Code, Customer, RV_No, Cust_Docu_No, Mtrl_Code, Shape, Material, DynamicPara1,
        DynamicPara2, DynamicPara3, DynamicPara4, Locked, Scrap, Issue, Weight, ScrapWeight,  NCProgramNo, LocationNo) 
        SELECT MtrlStockID, Mtrl_Rv_id, Cust_Code, Customer, RV_No, Cust_Docu_No,Mtrl_Code, Shape, Material, DynamicPara1, DynamicPara2, DynamicPara3,
        DynamicPara4, Locked, Scrap, Issue, Weight, ScrapWeight,  NCProgramNo, LocationNo FROM materialreturneddetails WHERE IV_No = '${IV_No}'`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.post("/insertByMtrlStockID", async (req, res, next) => {
  try {
    let {
      DynamicPara1,
      DynamicPara2,
      DynamicPara3,
      LocationNo,
      Weight,
      MtrlStockID,
      MtrlStockIDNew,
    } = req.body;
    misQueryMod(
      `INSERT INTO magodmis.mtrlstocklist (MtrlStockID,Mtrl_Rv_id, Cust_Code, Customer, RV_No, Cust_Docu_No, Mtrl_Code, Shape, 
      Material, DynamicPara1, DynamicPara2, DynamicPara3, LocationNo, Weight) 
      SELECT  ${MtrlStockIDNew}, m.Mtrl_Rv_id, m.Cust_Code, m.Customer, m.RV_No, m.Cust_Docu_No, m.Mtrl_Code, m.Shape, m.Material, 
      ${DynamicPara1}, ${DynamicPara2},${DynamicPara3}, '${LocationNo}', ${Weight} FROM magodmis.mtrlstocklist m 
      WHERE m.MtrlStockID= '${MtrlStockID}' `,
      (err, data) => {
        if (err) logger.error(err);
        logger.info("successfully inserted data into mtrlstocklist");
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

mtrlStockListRouter.get(
  "/getDataByMtrlStockIdResize",
  async (req, res, next) => {
    // console.log("${req.query.MtrlStockID}", req.query.MtrlStockID);
    try {
      // let rvno = req.query.MtrlStockID;
      misQueryMod(
        `
        SELECT * FROM magodmis.mtrlstocklist WHERE MtrlStockID = '${req.query.MtrlStockID}'`,
        // `Select * from magodmis.mtrlstocklist where MtrlStockID = '${req.query.MtrlStockID}'`,
        (err, data) => {
          if (err) logger.error(err);
          logger.info(
            `successfully fetched data from mtrlstocklist for MtrlStockID = '${req.query.MtrlStockID}'`
          );
          res.send(data);
          // console.log("getDataByMtrlStockIdResize.....data.......", data);
        }
      );
      //res.send(false);
    } catch (error) {
      next(error);
    }
  }
);

mtrlStockListRouter.post(
  "/insertByMtrlStockIDResize",
  async (req, res, next) => {
    try {
      misQueryMod(
        `INSERT INTO magodmis.mtrlstocklist(MtrlStockID, Mtrl_Rv_id, Cust_Code, Customer, RV_No, Mtrl_Code, Shape, Material, DynamicPara1, DynamicPara2, DynamicPara3, DynamicPara4, Locked, Scrap, Issue, Weight, ScrapWeight, IV_No, LocationNo) VALUES ('${req.body.MtrlStockID}', ${req.body.Mtrl_Rv_id}, '${req.body.Cust_Code}', '${req.body.Customer}','${req.body.RV_No}','${req.body.Mtrl_Code}', '${req.body.Shape}', '${req.body.Material}', '${req.body.DynamicPara1}', '${req.body.DynamicPara2}', '${req.body.DynamicPara3}', '${req.body.DynamicPara4}', ${req.body.Locked}, ${req.body.Scrap}, ${req.body.Issue}, '${req.body.Weight}', '${req.body.ScrapWeight}', '${req.body.IV_No}', '${req.body.LocationNo}')`,

        (err, data) => {
          if (err) logger.error(err);
          logger.info("successfully inserted data into mtrlstocklist");
          // console.log("insert done.......", data);
          res.send(data);
        }
      );
    } catch (error) {
      next(error);
    }
  }
);

mtrlStockListRouter.get("/getCustomerDetails", async (req, res, next) => {
  try {
    await misQueryMod(
      "SELECT Customer,Cust_Code FROM magodmis.mtrlstocklist group by Customer,Cust_Code order by Cust_Code not like 0000 ",
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = mtrlStockListRouter;
