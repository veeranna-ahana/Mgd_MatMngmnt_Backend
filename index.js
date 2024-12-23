const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const { logger } = require("./helpers/logger");
const compression = require("compression");
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(compression());

app.get("/", (req, res) => {
  res.send("hello");
});

// pdf
const PDFRouter = require("./routes/materialmgt/PDF");
app.use("/pdf", PDFRouter);

//customer
const customerRouter = require("./routes/materialmgt/customer");
app.use("/customers", customerRouter);

//cust bom list
const custBomListRouter = require("./routes/materialmgt/custBomList");
app.use("/custbomlist", custBomListRouter);

//material location list
const materialLocationListRouter = require("./routes/materialmgt/materialLocationList");
app.use("/materiallocationlist", materialLocationListRouter);

//mtrl data
const mtrlDataRouter = require("./routes/materialmgt/mtrlData");
app.use("/mtrlData", mtrlDataRouter);

//shape data
const shapeRouter = require("./routes/materialmgt/shapes");
app.use("/shapes", shapeRouter);

//material receipt voucher
const materialReceiptRegisterRouter = require("./routes/materialmgt/materialReceiptRegister");
app.use("/materialReceiptRegister", materialReceiptRegisterRouter);

//material part receipt details
const mtrlPartReceiptDetailsRouter = require("./routes/materialmgt/mtrlPartReceiptDetails");
app.use("/mtrlPartReceiptDetails", mtrlPartReceiptDetailsRouter);

//material receipt details
const mtrlReceiptDetailsRouter = require("./routes/materialmgt/mtrlReceiptDetails");
app.use("/mtrlReceiptDetails", mtrlReceiptDetailsRouter);

//material stock list
const mtrlStockListRouter = require("./routes/materialmgt/mtrlstocklist");
app.use("/mtrlStockList", mtrlStockListRouter);

//running No
const runningNoRouter = require("./routes/materialmgt/runningNo");
app.use("/runningNo", runningNoRouter);

//return section
const returnRouter = require("./routes/materialmgt/return");
app.use("/return", returnRouter);

//PendingDispatch
const materialIssueRegisterRouter = require("./routes/materialmgt/materialIssueRegister");
app.use("/materialIssueRegister", materialIssueRegisterRouter);

//OutwordMaterialIssueVocher
const mtrlIssueDetailsRouter = require("./routes/materialmgt/mtrlIssueDetails");
app.use("/mtrlIssueDetails", mtrlIssueDetailsRouter);

//material stock list
const materialReturnDetailsRouter = require("./routes/materialmgt/materialReturnDetails");
app.use("/materialReturnDetails", materialReturnDetailsRouter);

//customstocklist
const customStockList = require("./routes/materialmgt/customStocklist");
app.use("/customstocklist", customStockList);

//dcRegister
const dcRegisterRouter = require("./routes/materialmgt/dcregister");
app.use("/dcregister", dcRegisterRouter);

//dc details
const dcDetailsRouter = require("./routes/materialmgt/dcdetails");
app.use("/dcdetails", dcDetailsRouter);

//dc details
const mtrlPartIssueDetailsRouter = require("./routes/materialmgt/mtrlPartIssueDetails");
app.use("/mtrlPartIssueDetails", mtrlPartIssueDetailsRouter);

//shop floor issue
const shopFloorIssueRouter = require("./routes/materialmgt/shopFloorIssue");
app.use("/shopFloorIssue", shopFloorIssueRouter);

//shop floor return
const shopFloorReturnRouter = require("./routes/materialmgt/shopFloorReturn");
app.use("/shopFloorReturn", shopFloorReturnRouter);

//shopfloorAllotment
const shopFloorAllotmentRouter = require("./routes/materialmgt/shopfloorAllotment");
app.use("/shopfloorAllotment", shopFloorAllotmentRouter);

//shop floor bom issue details
const shopfloorBOMIssueDetailsRouter = require("./routes/materialmgt/shopfloorBOMIssueDetails");
app.use("/shopfloorBOMIssueDetails", shopfloorBOMIssueDetailsRouter);

//ncprogramsRouter
const ncprogramsRouter = require("./routes/materialmgt/ncprograms");
app.use("/ncprograms", ncprogramsRouter);

//shopfloorPartIssueRegisterRouter
const shopfloorPartIssueRegisterRouter = require("./routes/materialmgt/shopfloorPartIssueRegister");
app.use("/shopfloorPartIssueRegister", shopfloorPartIssueRegisterRouter);

//shopfloorUnitIssueRegisterRouter
const shopfloorUnitIssueRegisterRouter = require("./routes/materialmgt/shopfloorUnitIssueRegister");
app.use("/shopfloorUnitIssueRegister", shopfloorUnitIssueRegisterRouter);

//shopfloorMaterialIssueRegister
const shopfloorMaterialIssueRegisterRouter = require("./routes/materialmgt/shopfloorMaterialIssueRegister");
app.use(
  "/shopfloorMaterialIssueRegister",
  shopfloorMaterialIssueRegisterRouter
);

//ncprogrammtrlallotmentlist
const ncprogrammtrlallotmentlistRouter = require("./routes/materialmgt/ncprogrammtrlallotmentlist");
app.use("/ncprogrammtrlallotmentlist", ncprogrammtrlallotmentlistRouter);

//store router
const storeRouter = require("./routes/materialmgt/storeMng");
app.use("/storeMng", storeRouter);

//report router
const reportRouter = require("./routes/materialmgt/report");
app.use("/report", reportRouter);

//user router
const userRouter = require("./routes/materialmgt/user");
app.use("/user", userRouter);

const savePDF = require("./routes/savePDFServer/savePDFServer.js");
app.use("/PDF", savePDF);

/*app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
  logger.error(`Status Code : ${err.status}  - Error : ${err.message}`);
});*/

// starting the server
app.listen(process.env.PORT, () => {
  console.log("listening on port " + process.env.PORT);
  logger.info("listening on port " + process.env.PORT);
});
