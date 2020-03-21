const express = require("express");
const router = express.Router();
const RateLimit = require("express-rate-limit");
const lookup = require("country-code-lookup");
const moment = require("moment");
const User = require("../models/user");

// Attempt to limit spam post requests for inserting data
const minutes = 5;
const defaultCountryISOAlpha3 = "USA";

const postLimiter = new RateLimit({
  windowMs: minutes * 60 * 1000, // milliseconds
  max: 100, // Limit each IP to 100 requests per windowMs
  delayMs: 0, // Disable delaying - full speed until the max limit is reached
  handler: (req, res) => {
    res
      .status(429)
      .json({
        success: false,
        msg: `You made too many requests. Please try again after ${minutes} minutes.`
      });
  }
});

// READ (ALL)
router.get("/:startDate?/:endDate?", postLimiter, (req, res) => {
  let query = {};
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  if (startDate && !endDate) {
    query.updated = { $gte: new Date(startDate) };
  } else if (startDate && endDate) {
    query.updated = { $gte: new Date(startDate), $lte: new Date(endDate) };
  }

  User.aggregate([
    {
      $match: { updated: query.updated }
    },
    {
      $group: { _id: "$countryCodeAlpha3", countryCodeAlpha3: { "$first": "$countryCodeAlpha3" }, count: { $sum: "$count" } }
    },
    { 
      $sort : { count : -1 } 
    }
  ])
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res
        .status(500)
        .json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

router.get("/count/:startDate/:endDate", postLimiter, (req, res) => {
  const startDate = req.params.startDate;
  const endDate = req.params.endDate;
  User.aggregate([
    {
      $match: {
        updated: { $gte: new Date(startDate), $lte: new Date(endDate) }
      }
    },
    {
      $group: { _id: null, totalCount: { $sum: "$count" } }
    }
  ])
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res
        .status(500)
        .json({ success: false, msg: `Something went wrong. ${err}` });
    });
});

// CREATE or UPDATE
router.put("/", postLimiter, (req, res) => {
  let countryCode = req.body.countryCodeAlpha2;
  if (countryCode) {
    countryCode = lookup.byIso(countryCode).iso3;
  } else {
    countryCode = defaultCountryISOAlpha3;
  }

  let updated = moment().format("YYYY-MM-DDT00:00:00.000") + "Z";
  let updatedUser = {
    $inc: { count: 1 },
    updated: updated
  };

  User.findOneAndUpdate(
    { countryCodeAlpha3: countryCode, updated: { $eq: new Date(updated) } },
    updatedUser,
    { upsert: true }
  )
    .then(oldResult => {
      User.findOne({ countryCodeAlpha3: countryCode, updated: updated })
        .then(newResult => {
          res.json({
            success: true,
            msg: `Successfully updated!`,
            result: {
              _id: newResult._id,
              countryCodeAlpha3: newResult.countryCodeAlpha3,
              count: newResult.count,
              updated: newResult.updated
            }
          });
        })
        .catch(err => {
          res
            .status(500)
            .json({ success: false, msg: `Something went wrong. ${err}` });
          return;
        });
    })
    .catch(err => {
      if (err.errors) {
        // Show failed if all else fails for some reasons
        res
          .status(500)
          .json({ success: false, msg: `Something went wrong. ${err}` });
      }
    });
});

module.exports = router;