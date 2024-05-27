const reportRouter = require("express").Router();
const { misQueryMod, mtrlQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

/* 1. daily report */
reportRouter.get("/getDailyReportMaterialReceipt1", async (req, res, next) => {
  try {
    let date = req.query.date;
    console.log("date", req.query.date);
    misQueryMod(
      `SELECT A.*,s.Shape,m.Mtrl_Rv_id,m.mtrl_code,m.material, m.qty, m.totalWeight, m.totalweightcalculated 
      FROM (SELECT m.RV_No, m.RV_Date, m.Customer, m.CustDocuNo,
        m.RvID, m.Cust_Code 
      FROM magodmis.material_receipt_register m 
      WHERE m.RV_Date='${date}' Or m.RV_No ='Draft') As A 
      left join magodmis.mtrlreceiptdetails m on a.rvid=m.rvid 
      left join magodmis.shapes s on s.shapeid=m.shapeid ORDER BY a.Rv_No`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

reportRouter.get("/getDailyReportMaterialReceipt2", async (req, res, next) => {
  try {
    let date = req.query.date;
    misQueryMod(
      //   `select b.* FROM (Select A.*,s.Shape ,m.Mtrl_Rv_id,m.mtrl_code,m.material, m.qty, m.totalWeight, m.totalweightcalculated
      // FROM (SELECT m.Type, m.RV_No, m.RV_Date, m.Cust_Code, m.Customer, m.CustDocuNo, m.RvID
      // FROM magodmis.material_receipt_register m
      // WHERE m.RV_Date='${date}' AND m.Type='Sheets') as A left join magodmis.mtrlreceiptdetails m on a.rvid=m.rvid
      // left join magodmis.shapes s on s.shapeid=m.shapeid
      // UNION
      // SELECT A.*, 'Parts' as Shape ,m.Id as Mtrl_Rv_id,m.PartId as mtrl_code, c.material as material, m.qtyreceived as qty,
      // m.qtyreceived*m.unitwt as totalWeight, m.qtyreceived*m.unitwt as totalweightcalculated
      // FROM (SELECT m.Type, m.RV_No, m.RV_Date, m.Cust_Code, m.Customer, m.CustDocuNo, m.RvID
      // FROM magodmis.material_receipt_register m
      // WHERE m.RV_Date='${date}' AND m.Type='Parts') as A left join magodmis.mtrl_part_receipt_details m on a.rvid=m.rvid
      // left join magodmis.cust_bomlist c On c.id=m.CustBOM_Id) as B
      //     ORDER BY B.RV_No`,
      `SELECT 
    B.*
FROM
    (SELECT 
        A.*,
            s.Shape,
            m.Mtrl_Rv_id,
            m.mtrl_code,
            m.material,
            m.qty,
            m.totalWeight,
            m.totalweightcalculated
    FROM
        (SELECT 
        m.Type,
            m.RV_No,
            m.RV_Date,
            m.Cust_Code,
            m.Customer,
            m.CustDocuNo,
            m.RvID
    FROM
        magodmis.material_receipt_register m
    WHERE
        m.RV_Date = '${date}'
            AND (m.Type = 'Sheets' OR m.Type = 'Units')) AS A
    LEFT JOIN magodmis.mtrlreceiptdetails m ON a.rvid = m.rvid
    LEFT JOIN magodmis.shapes s ON s.shapeid = m.shapeid
		UNION
    SELECT 
        A.*,
            'Parts' AS Shape,
            m.Id AS Mtrl_Rv_id,
            m.PartId AS mtrl_code,
            c.material AS material,
            m.qtyreceived AS qty,
            m.qtyreceived * m.unitwt AS totalWeight,
            m.qtyreceived * m.unitwt AS totalweightcalculated
    FROM
        (SELECT 
        m.Type,
            m.RV_No,
            m.RV_Date,
            m.Cust_Code,
            m.Customer,
            m.CustDocuNo,
            m.RvID
    FROM
        magodmis.material_receipt_register m
    WHERE
        m.RV_Date = '${date}'
            AND m.Type = 'Parts') AS A
    LEFT JOIN magodmis.mtrl_part_receipt_details m ON a.rvid = m.rvid
    LEFT JOIN magodmis.cust_bomlist c ON c.id = m.CustBOM_Id) AS B
ORDER BY B.RV_No`,
      (err, data) => {
        if (err) logger.error(err);
        console.log("dataaaaaaaaaaaaaa", data);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

reportRouter.get("/getDailyReportMaterialDispatch", async (req, res, next) => {
  try {
    let date = req.query.date;
    misQueryMod(
      `SELECT A.* ,d.Mtrl, d.Material, d.SrlWt,
    d.SummarySrl FROM (SELECT  d.Inv_No, d.Inv_Date, d.DC_InvType, d.Cust_Name,d.Dc_Inv_No
    FROM magodmis.draft_dc_inv_register d 
    WHERE d.Inv_Date='${date}' AND not d.DC_InvType like 'Combined') as A, 
    magodmis.dc_inv_summary d WHERE a.dc_Inv_No=d.dc_Inv_no 
   Order By a.inv_no, a.DC_InvType`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

reportRouter.post("/updateSrlWghtMaterialDispatch", async (req, res, next) => {
  // console.log("reqqqqqqqqqqqq.............", req.body.tableData);

  // const resultArray = [];
  try {
    for (let i = 0; i < req.body.tableData.length; i++) {
      const element = req.body.tableData[i];

      // console.log("element.....", i, element);
      misQueryMod(
        `UPDATE magodmis.dc_inv_summary
          SET
        SrlWt = '${element.SrlWt}'
          WHERE
        DC_Inv_No = ${element.Dc_Inv_No} AND SummarySrl = ${element.SummarySrl}`,
        (err, data) => {
          if (err) logger.error(err);
          // console.log("done", i, data);
          // resultArray.push("1");

          // console.log(
          //   "req.body.tableData.lengthreq.body.tableData.lengthreq.body.tableData.length"
          // );
          // res.send(data);
        }
      );
      // console.log("resultarray...", resultArray);
    }
    // console.log("testestetstesteste");

    // console.log("resultArray.length", resultArray, resultArray.length);

    res.send({
      flag: 1,
      message: "Updated Successfully",
    });

    // console.log("req.body.tableData.length", req.body.tableData.length);

    // if (resultArray.length === req.body.tableData.length) {
    //   console.log("trueeeeeeee");
    //   res.send({
    //     flag: 1,
    //     message: "Update Successfull",
    //   });
    // }
  } catch (error) {
    next(error);
  }
});

reportRouter.get("/getDailyReportMaterialSales", async (req, res, next) => {
  try {
    let date = req.query.date;
    misQueryMod(
      `select A.Inv_No, A.dc_invType, A.SrlWt, A.Material ,B.Cust_Name
      from 
     (select c.Inv_No, d.dc_invType, sum(d.SrlWt) as SrlWt, d.Material
     from magodmis.draft_dc_inv_register c, magodmis.dc_inv_summary d 
     where c.DC_Inv_No = d.DC_Inv_No and 
     c.Inv_Date='${date}' AND (c.DC_InvType ='Sales' or c.DC_InvType like 'Material%')
     group by c.Inv_No, d.dc_invType,d.material) as A,
     
     (SELECT  d.DC_InvType,d.Cust_Code, d.Cust_Name,d.Dc_Inv_No, d.Inv_No, d.Inv_Date
     FROM magodmis.draft_dc_inv_register d 
     WHERE d.Inv_Date='${date}' AND (d.DC_InvType ='Sales' or d.DC_InvType like 'Material%')) as B
     
     where A.Inv_No = B.Inv_No;`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

/*
SELECT GROUP_CONCAT( distinct (m.RV_No)) as RV_No, m.RV_Date, GROUP_CONCAT( distinct (m.Cust_Code)) as Cust_Code, 
      GROUP_CONCAT( distinct (m.Customer)) as Customer, GROUP_CONCAT( distinct (m.CustDocuNo)) as CustDocuNo, 
      m1.Material, sum(m1.TotalWeightCalculated) as TotalWeightCalculated,
      sum(m1.TotalWeight) as TotalWeight, sum(m1.Qty) as qty 
      FROM magodmis.material_receipt_register m,magodmis.mtrlreceiptdetails m1 
      WHERE m.RV_No not like 'Draft' and m.RvID=m1.RvID AND m1.Cust_Code='0000' AND m.RV_Date='${date}' 
      GROUP BY m1.RV_No, m1.Material
       */
reportRouter.get("/getDailyReportMaterialPurchase", async (req, res, next) => {
  try {
    let date = req.query.date;
    misQueryMod(
      `SELECT m.RV_No, m.RV_Date, m.Cust_Code, m.Customer, 
                                m.CustDocuNo, d.Material, d.TotalWeightCalculated,
                                d.TotalWeight, d.qty 
                                FROM 
                                (SELECT m1.Material, sum(m1.TotalWeightCalculated) as TotalWeightCalculated,
                                sum(m1.TotalWeight) as TotalWeight, sum(m1.Qty) as qty 
                                from magodmis.material_receipt_register m, mtrlreceiptdetails m1 
                                WHERE m.RV_No not like 'Draft' and m.RvID=m1.RvID AND m1.Cust_Code='0000' AND m.RV_Date='${date}' 
                                GROUP BY m1.Material) as d,magodmis.material_receipt_register m, mtrlreceiptdetails m1
                                WHERE m.RV_No not like 'Draft' and m.RvID=m1.RvID AND m1.Cust_Code='0000' AND m.RV_Date='${date}' 
                                and m1.Material = d.Material limit 1`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

//monthly report
reportRouter.get(
  "/getMonthlyReportMaterialPurchaseDetails",
  async (req, res, next) => {
    try {
      let month = req.query.month;
      let year = req.query.year;
      misQueryMod(
        `SELECT m.RV_No, m.RV_Date, m.Cust_Code, m.Customer, 
    m.CustDocuNo, m1.Material, sum(m1.TotalWeightCalculated) as TotalWeightCalculated,
    sum(m1.TotalWeight) as TotalWeight, sum(m1.Qty) as qty 
    FROM magodmis.material_receipt_register m,magodmis.mtrlreceiptdetails m1 
    WHERE m.RV_No not like 'Draft' and m.RvID=m1.RvID AND m1.TotalWeightCalculated is not Null 
    AND m1.Cust_Code='0000' AND EXTRACT(YEAR from m.RV_Date)=${year} and 
    EXTRACT(MONTH from m.RV_Date)=${month}
    GROUP BY  m1.Material,m.RV_No, m.RV_Date, m.Cust_Code, m.Customer, m.CustDocuNo
    order by m1.material`,
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

reportRouter.get(
  "/getMonthlyReportMaterialSalesSummary",
  async (req, res, next) => {
    try {
      let month = req.query.month;
      let year = req.query.year;
      misQueryMod(
        `SELECT d.Material, sum(d.SrlWt) as SrlWt, f.DC_InvType
        from magodmis.dc_inv_summary d , magodmis.draft_dc_inv_register f
        WHERE d.dc_Inv_No=f.dc_Inv_no and
        EXTRACT(YEAR from f.Inv_Date)=${year} and EXTRACT(MONTH from f.Inv_Date)=${month} and
                    (f.DC_InvType ='Sales' or f.DC_InvType like 'Material%')
       Group By d.material,f.DC_InvType`,
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

reportRouter.get(
  "/getMonthlyReportMaterialPurchaseSummary",
  async (req, res, next) => {
    try {
      let month = req.query.month;
      let year = req.query.year;
      misQueryMod(
        `SELECT  m1.Material, sum(m1.TotalWeightCalculated) as TotalWeightCalculated,
        sum(m1.TotalWeight) as TotalWeight, sum(m1.Qty) as qty 
        FROM magodmis.material_receipt_register m,magodmis.mtrlreceiptdetails m1 
        WHERE m.RV_No not like 'Draft' and m.RvID=m1.RvID AND m1.TotalWeightCalculated is not Null 
        AND m1.Cust_Code='0000' AND 
        EXTRACT(YEAR from m.RV_Date)=${year} and EXTRACT(MONTH from m.RV_Date)=${month} 
        GROUP BY  m1.Material
        order by Material`,
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

reportRouter.get(
  "/getMonthlyReportMaterialSalesDetails",
  async (req, res, next) => {
    try {
      let month = req.query.month;
      let year = req.query.year;
      misQueryMod(
        `SELECT b.Cust_Name,b.Inv_Date,b.Inv_No,b.material,sum(b.srlWt) as SrlWt, b.DC_InvType FROM 
        (SELECT A.* ,d.Mtrl, d.Material, d.SrlWt 
         FROM (SELECT   d.DC_InvType, d.Cust_Name,d.Dc_Inv_No,d.Inv_No,d.Inv_Date 
        FROM magodmis.draft_dc_inv_register d 
        WHERE EXTRACT(YEAR from d.Inv_Date)=${year} and EXTRACT(MONTH from d.Inv_Date)=${month} 
        AND  (d.DC_InvType like 'Sales' or d.DC_InvType like 'Material%') ) as A, 
        magodmis.dc_inv_summary d WHERE a.dc_Inv_No=d.dc_Inv_no 
       Order By a.DC_InvType) as B GROUP BY b.cust_Name, b.Inv_Date,b.Inv_No,b.material,b.DC_InvType
       Order by b.cust_Name`,
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

reportRouter.get(
  "/getMonthlyReportMaterialHandlingSummary",
  async (req, res, next) => {
    try {
      let month = req.query.month;
      let year = req.query.year;
      misQueryMod(
        `SELECT  'Receipts' as Type ,m1.Material, sum(m1.TotalWeightCalculated) as TotalWeightCalculated, 
        sum(m1.TotalWeight) as TotalWeight, sum(m1.Qty) as qty 
        FROM magodmis.material_receipt_register m,magodmis.mtrlreceiptdetails m1 
        WHERE m.RV_No not like 'Draft' and m.RvID=m1.RvID 
        AND m1.TotalWeightCalculated is not Null 
        AND EXTRACT(YEAR from m.RV_Date)=${year} and EXTRACT(MONTH from m.RV_Date)=${month} 
        GROUP BY  m1.Material 
        UNION 
        SELECT   'Despatch' as Type, d.Material,sum(d.SrlWt) as TotalWeightCalculated,
        sum(d.SrlWt) as TotalWeight,sum(d.TotQty) as Qty 
        FROM (SELECT  d.DC_InvType, d.Dc_Inv_No 
        FROM magodmis.draft_dc_inv_register d 
        WHERE 
        EXTRACT(YEAR from d.Inv_Date)=${year} and EXTRACT(MONTH from d.Inv_Date)=${month} AND
        (d.Inv_No is not null and d.Inv_No  not like 'C%')) as A, 
        magodmis.dc_inv_summary d WHERE a.dc_Inv_No=d.dc_Inv_no 
        Group By d.material `,
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

//Part List
reportRouter.get("/getPartListInStockAndProcess", async (req, res, next) => {
  try {
    let code = req.query.code;
    misQueryMod(
      `SELECT m.*, m1.RV_No, m1.RV_Date 
          FROM magodmis.mtrl_part_receipt_details m,magodmis.material_receipt_register m1 
          WHERE m.QtyAccepted >  m.QtyUsed+m.QtyReturned AND m1.Cust_Code=${code} AND m1.RvID=m.RVId`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

reportRouter.get("/getPartListReceiptAndUsageFirst", async (req, res, next) => {
  try {
    let code = req.query.code;
    misQueryMod(
      `SELECT m.* FROM magodmis.material_receipt_register m 
        WHERE m.Type='Parts' AND m.Cust_Code =${code} ORDER BY m.RV_Date Desc`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

reportRouter.get(
  "/getPartListReceiptAndUsageSecond",
  async (req, res, next) => {
    try {
      let id = req.query.id;
      misQueryMod(
        `SELECT * FROM magodmis.mtrl_part_receipt_details m WHERE m.RVId= ${id}`,
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

reportRouter.get("/getPartListReceiptAndUsageThird", async (req, res, next) => {
  try {
    let id = req.query.id;
    misQueryMod(
      `SELECT sum(s.QtyIssued) as QtyIssued, sum(s.QtyUsed) as QtyUsed , 
          sum(s.QtyReturned) as QtyReturned, s1.NC_ProgramNo as NCProgramNo 
          FROM magodmis.mtrl_part_receipt_details m,magodmis.shopfloor_bom_issuedetails s,
          magodmis.shopfloor_part_issueregister s1 
          WHERE m.Id=${id} AND s.PartReceipt_DetailsID=m.Id and s1.IssueID=s.IV_ID 
           GROUP BY s1.NC_ProgramNo`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

reportRouter.get(
  "/getPartListReceiptAndUsageFourth",
  async (req, res, next) => {
    try {
      let ncno = req.query.id1;
      let partid = req.query.id2;
      misQueryMod(
        `SELECT s.IV_No,s.Issue_date,s1.QtyIssued, s1.QtyUsed, s1.QtyReturned, s.Remarks 
        FROM magodmis.shopfloor_part_issueregister s,magodmis.shopfloor_bom_issuedetails s1 
        WHERE s.NC_ProgramNo =${ncno} AND s.IssueID=s1.IV_ID AND s1.PartReceipt_DetailsID=${partid}`,
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

module.exports = reportRouter;
