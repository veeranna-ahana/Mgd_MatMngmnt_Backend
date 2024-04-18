const runningNoRouter = require("express").Router();
const { setupQuery, setupQueryMod } = require("../../helpers/dbconn");
const req = require("express/lib/request");
const { logger } = require("../../helpers/logger");

runningNoRouter.get("/getRunningNoBySrlType", async (req, res, next) => {
  try {
    let SrlType = req.query.SrlType;
    console.log("SrlType..........", SrlType);
    let Period = req.query.Period;

    // let UnitName = req.query.UnitName;

    // console.log("SrlType", SrlType);
    // console.log("Period", Period);
    // console.log("UnitName", UnitName);
    setupQueryMod(
      `Select * from magod_setup.magod_runningno where SrlType = "${SrlType}" and Period = "${Period}"`,
      // `Select * from magod_setup.magod_runningno where SrlType = "${SrlType}" and Period = "${Period}" and UnitName="${UnitName}"`,
      (err, data) => {
        if (err) logger.error(err);
        console.log("rnno_data......", data);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

runningNoRouter.post("/updateRunningNoBySrlType", async (req, res, next) => {
  try {
    //console.log("updateRunningNoBySrlType", req.body);
    let { SrlType, Period, RunningNo } = req.body;
    setupQueryMod(
      `update magod_runningno set Running_No = "${RunningNo}" where  SrlType = "${SrlType}" and Period = "${Period}"`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

runningNoRouter.post("/insertRunningNo", async (req, res, next) => {
  try {
    //console.log("insertRunningNo", req.body);
    // let { SrlType, Period, RunningNo } = req.body;
    setupQueryMod(
      `INSERT INTO magod_setup.magod_runningno
        (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, UnitIntial, Prefix, Suffix, Length, DerivedFrom, Period, Running_EffectiveDate)
      VALUES
      ('${req.body.UnitName}', '${req.body.SrlType}', '${
        req.body.ResetPeriod
      }', '${req.body.ResetValue || 0}', '${req.body.EffectiveFrom_date}', '${
        req.body.Reset_date
      }', '${req.body.Running_No}', '${req.body.UnitIntial}', '${
        req.body.Prefix || ""
      }', '${req.body.Suffix || ""}', '${req.body.Length || 4}', '${
        req.body.DerivedFrom || 0
      }', '${req.body.Period || ""}', now())`,
      (err, data) => {
        if (err) logger.error(err);
        res.send(data);
      }
    );
  } catch (error) {
    next(error);
  }
});

runningNoRouter.post("/getAndInsertRunningNo", async (req, res, next) => {
  try {
    setupQueryMod(
      `Select * from magod_setup.magod_runningno where SrlType = "${req.body.SrlType}" and Period = "${req.body.Period}" and UnitName="${req.body.UnitName}"`,
      (err, data) => {
        if (err) {
          logger.error(err);
        } else {
          if (data.length > 0) {
            res.send(data);
          } else {
            try {
              setupQueryMod(
                `INSERT INTO magod_setup.magod_runningno
                  (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, UnitIntial, Prefix, Suffix, Length, DerivedFrom, Period, Running_EffectiveDate)
                VALUES
                ('${req.body.UnitName}', '${req.body.SrlType}', '${
                  req.body.ResetPeriod || "Year"
                }', '${req.body.ResetValue || 0}', '${
                  req.body.EffectiveFrom_date
                }', '${req.body.Reset_date}', '${req.body.Running_No || 0}', '${
                  req.body.UnitIntial || 0
                }', '${req.body.Prefix || ""}', '${req.body.Suffix || ""}', '${
                  req.body.Length || 4
                }', '${req.body.DerivedFrom || 0}', '${
                  req.body.Period || 0
                }', now())`,
                (err, insertData) => {
                  if (err) {
                    logger.error(err);
                  } else {
                    try {
                      setupQueryMod(
                        `Select * from magod_setup.magod_runningno where Id = '${insertData.insertId}'`,
                        (err, selectData) => {
                          if (err) {
                            logger.error(err);
                          } else {
                            res.send(selectData);
                          }
                        }
                      );
                    } catch (error) {
                      next(error);
                    }
                  }
                }
              );
            } catch (error) {
              next(error);
            }
          }
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

runningNoRouter.post("/insertRunNoRow", async (req, res, next) => {
  const { unit, srlType, ResetPeriod, ResetValue, VoucherNoLength } = req.body;

  const unitName = `${unit}`;
  const date = new Date();
  // const date = new Date("2024-04-01");
  const year = date.getFullYear();

  const YearStartDate = new Date(`${year}-01-01`);
  const YearEndDate = new Date(`${year}-12-31`);

  const formattedStartDate = YearStartDate.toISOString().slice(0, 10);
  const formattedEndDate = YearEndDate.toISOString().slice(0, 10);

  try {
    const selectQuery = `
    SELECT COUNT(Id) FROM magod_setup.magod_runningno  WHERE SrlType='${srlType}'
    AND UnitName='${unit}' AND Period='${year}'
    `;

    setupQueryMod(selectQuery, (selectError, selectResult) => {
      if (selectError) {
        logger.error(selectError);
        return next(selectResult);
      }

      const count = selectResult[0]["COUNT(Id)"];

      if (count === 0) {
        // If count is 0, execute the INSERT query
        const insertQuery = `
        INSERT INTO magod_setup.magod_runningno
        (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, Length, Period, Running_EffectiveDate)
        VALUES ('${unit}', '${srlType}', '${ResetPeriod}', ${ResetValue}, '${formattedStartDate}', '${formattedEndDate}', ${ResetValue}, ${VoucherNoLength}, '${year}', CURDATE());

        `;

        // Execute the INSERT query
        setupQueryMod(insertQuery, (insertError, insertResult) => {
          if (insertError) {
            logger.error(insertError);
            return next(insertResult);
          }

          res.json({ message: "Record inserted successfully." });
        });
      } else {
        res.json({ message: "Record already exists." });
      }
    });
  } catch (error) {
    console.error("An error occurred:", error);
    next(error);
  }
});

runningNoRouter.post("/insertAndGetRunningNo", async (req, res, next) => {
  // console.log("reqqqq", req.body);

  let Running_No = 0;

  const todayDate = new Date();

  let finYear = `${
    (todayDate.getMonth() + 1 < 4
      ? todayDate.getFullYear() - 1
      : todayDate.getFullYear()
    )
      .toString()
      .slice(-2) +
    "/" +
    (todayDate.getMonth() + 1 < 4
      ? todayDate.getFullYear()
      : todayDate.getFullYear() + 1
    )
      .toString()
      .slice(-2)
  }`;

  let Period = `${todayDate.getFullYear()}`;

  try {
    setupQueryMod(
      `SELECT 
            *
          FROM
            magod_setup.magod_runningno
          WHERE
            UnitName = '${req.body.unitName}' AND SrlType = '${req.body.srlType}'
            AND ResetPeriod = '${req.body.ResetPeriod}'
            AND Period = '${req.body.Period}'`,
      (err, selectRN1) => {
        if (err) {
          logger.error(err);
        } else {
          // console.log("selectRN1", selectRN1);

          if (selectRN1.length === 0) {
            try {
              setupQueryMod(
                `SELECT 
                      *
                    FROM
                        magod_setup.year_prefix_suffix
                    WHERE
                        UnitName = '${req.body.unitName}' AND SrlType = '${req.body.srlType}'`,
                (err, selectYearPrefixSuffix) => {
                  if (err) {
                    logger.error(err);
                  } else {
                    // console.log(
                    //   "selectYearPrefixSuffix",
                    //   selectYearPrefixSuffix
                    // );
                    // let EffectiveFrom_date = `${
                    //   todayDate.getFullYear() + "-04-01"
                    // }`;
                    // let Reset_date = `${
                    //   todayDate.getFullYear() + 1 + "-03-31"
                    // }`;
                    setupQueryMod(
                      `INSERT INTO magod_setup.magod_runningno
                            (UnitName, SrlType, ResetPeriod, ResetValue, EffectiveFrom_date, Reset_date, Running_No, Prefix, Suffix, Length, Period, Running_EffectiveDate)
                          VALUES
                            ('${selectYearPrefixSuffix[0].UnitName || ""}', '${
                        selectYearPrefixSuffix[0].SrlType || ""
                      }', '${req.body.ResetPeriod || ""}', '${
                        req.body.ResetValue || 0
                      }', '${req.body.EffectiveFrom_date}', '${
                        req.body.Reset_date
                      }', '${Running_No}', '${
                        selectYearPrefixSuffix[0].Prefix || ""
                      }', '${selectYearPrefixSuffix[0].Suffix || ""}', '${
                        req.body.Length || 5
                      }', '${req.body.Period || ""}', now())`,
                      (err, insertRunningNo) => {
                        if (err) {
                          logger.error(err);
                        } else {
                          // console.log("insertRunningNo", insertRunningNo);

                          setupQueryMod(
                            `SELECT * FROM magod_setup.magod_runningno WHERE Id = ${insertRunningNo.insertId}`,
                            (err, selectRunningNo) => {
                              if (err) {
                                logger.error(err);
                              } else {
                                res.send({
                                  runningNoData: selectRunningNo[0],
                                  message: "running no inserted",
                                });
                                // console.log("selectRunningNo", selectRunningNo);
                              }
                            }
                          );
                        }
                      }
                    );
                  }
                }
              );
            } catch (error) {
              next(error);
            }
          } else {
            res.send({
              runningNoData: selectRN1[0],
              message: "fechted running no",
            });
          }
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

runningNoRouter.post("/getAndUpdateRunningNo", async (req, res, next) => {
  try {
    setupQueryMod(
      `SELECT 
          *
        FROM
          magod_setup.year_prefix_suffix
        WHERE
          UnitName = '${req.body.runningNoData.UnitName}' AND SrlType = '${req.body.runningNoData.SrlType}'`,
      (err, yearPrefixSuffixData) => {
        if (err) {
          logger.error(err);
        } else {
          setupQueryMod(
            `UPDATE magod_setup.magod_runningno SET Running_No = '${parseInt(
              req.body.newRunningNo
            )}', Prefix = '${
              yearPrefixSuffixData[0].Prefix || ""
            }', Suffix = '${
              yearPrefixSuffixData[0].Suffix || ""
            }' WHERE (Id = '${req.body.runningNoData.Id}')`,
            (err, updateRunningNo) => {
              if (err) {
                logger.error(err);
              } else {
                // console.log("updated running no");
                res.send({
                  flag: true,
                  message: "running updated",
                });
              }
            }
          );
        }
      }
    );
  } catch (error) {
    next(error);
  }
});

module.exports = runningNoRouter;
