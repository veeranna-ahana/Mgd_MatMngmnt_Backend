/** @format */

const shopfloorUnitIssueRegisterRouter = require("express").Router();
const { misQueryMod, setupQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

shopfloorUnitIssueRegisterRouter.get(
  "/getMaterialAllotmentTable1",
  async (req, res, next) => {
    try {
      let MtrlCode = req.query.MtrlCode;
      // VEERANNA PURCHASE CHANGES 17/10/24
      // let CustCode = req.query.CustCode;
      if (req.query.CustMtrl === "Magod") {
        CustCode = "0000";
      } else {
        CustCode = req.query.CustCode;
      }

      let shape = req.query.shape;
      let para1 = req.query.para1;
      let para2 = req.query.para2;
      //   let query = `SELECT * FROM magodmis.mtrlstocklist m WHERE m.cust_Code=${CustCode} AND
      // m.Mtrl_Code='${MtrlCode}' And  m.Locked=0 AND m.Scrap=0 `;
      // console.log("req.query", req.query);

      //   let query = `SELECT * FROM magodmis.mtrlstocklist m WHERE m.cust_Code=${CustCode} AND
      // m.Mtrl_Code='${MtrlCode}' And  m.Locked=0 AND m.Scrap=0 `;

      //     let query = `SELECT * FROM magodmis.mtrlstocklist m WHERE m.cust_Code=${CustCode} AND
      //  m.Mtrl_Code='${MtrlCode}' And  m.Locked=0 AND m.Scrap=0 ORDER BY
      //   SUBSTRING(MtrlStockID, 1, 8) ASC,
      //   CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(MtrlStockID, '/', -1), '/', 1) AS SIGNED) ASC,
      //   SUBSTRING(MtrlStockID, 9, 2) ASC`;

      let query = `SELECT * FROM magodmis.mtrlstocklist m WHERE m.cust_Code = ${CustCode} AND m.Mtrl_Code = '${MtrlCode}' AND m.Locked = 0 AND m.Scrap = 0 ORDER BY SUBSTRING(MtrlStockID, 1, 8) ASC, SUBSTRING(MtrlStockID, 9, 2) ASC, CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(MtrlStockID, '/', -1), '/', 1) AS SIGNED) ASC;`;

      if (shape === "Sheet") {
        query += `AND ((DynamicPara1>=${para1} AND DynamicPara2>=${para2}) OR (DynamicPara2>=${para1} AND DynamicPara1>=${para2}))`;
      } else if (shape === "Tube Rectangle") {
        query += `AND (DynamicPara1>=${para1} )`;
      } else if (shape === "Tube Square") {
        query += `AND (DynamicPara1>=${para1} )`;
      } else if (shape === "Tube Round") {
        query += `AND (DynamicPara1>=${para1} )`;
      }
      // console.log("query = ", query);

      await misQueryMod(query, (err, data) => {
        if (err) logger.error(err);
        logger.info("successfully fetched data from mtrlstocklist");
        res.send(data);
      });
    } catch (error) {
      next(error);
    }
  }
);

// shopfloorUnitIssueRegisterRouter.get("/getPDFData", async (req, res, next) => {
//   try {
//     setupQueryMod(
//       `SELECT * FROM magod_setup.magodlaser_units`,
//       (err, pdfData) => {
//         if (err) {
//           console.log("err", err);
//         } else {
//           res.send(pdfData);
//         }
//       }
//     );
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = shopfloorUnitIssueRegisterRouter;
