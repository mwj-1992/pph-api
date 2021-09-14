const express = require("express");
const { validationResult, query, check } = require("express-validator");
const bcrypt = require("bcryptjs");
const _ = require("lodash");
const Models = require("../models");

const router = express.Router();
/**
 * Retrieve all Ricky&Morty Docs
 */
router.get(
  "/",
  [
    query("name").isString().optional(),
    query("gender").isString().optional(),
    query("status").isString().optional(),
    query("type").isString().optional(),
    query("species").isString().optional(),
    query("created").isString().optional(),
    query("order_by").isString().optional(),
    query("limit").isNumeric().optional(),
    query("offset").isNumeric().optional(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    const skip = req.query.offset || 0;
    const orderBy = req.query.order_by || "-created";
    const limit = parseInt(req.query.limit, 10) || 20;
    const search = {};
    if (_.get(req.query, "created"))
      _.set(search, "created", {
        $gte: new Date(_.get(req.query, "created")),
        $lte: (new Date(_.get(req.query, "created")).setHours(23, 59, 59, 999)),
      });
    if (_.get(req.query, "last_login"))
      _.set(search, "last_login", {
        $gte: new Date(_.get(req.query, "last_login")),
        $lte: (new Date(_.get(req.query, "last_login")).setHours(23, 59, 59, 999)),
      });
    if (_.get(req.query, "name")) {
      search.name = { $regex: _.get(req.query, "name"), $options: "-i" };
    }
    if (_.get(req.query, "status")) {
      search.status = { $regex: _.get(req.query, "status"), $options: "-i" };
    }
    if (_.get(req.query, "species")) {
      search.species = { $regex: _.get(req.query, "species"), $options: "-i" };
    }
    if (_.get(req.query, "type")) {
      search.type = { $regex: _.get(req.query, "type"), $options: "-i" };
    }
    if (_.get(req.query, "location")) {
      search['location.name'] = { $regex: _.get(req.query, "location"), $options: "-i" };
    } if (_.get(req.query, "origin")) {
      search['origin.name'] = { $regex: _.get(req.query, "origin"), $options: "-i" };
    }
    if (_.get(req.query, "gender")) {
      search.gender = { $regex: `^${_.get(req.query, "gender")}$`, $options: "-i" };
    }
    if (_.get(req.query, "email"))
      search.email = { $regex: _.get(req.query, "email"), $options: "-i" };
    const queryStatement = Models.RickAndMorty.find(search)
      .sort(orderBy)
      .skip(skip * limit)
      .limit(parseInt(limit, 10));
    return queryStatement.exec((err, data) => {
      if (err) {
        return res.json({
          msg: "Something went wrong",
          error: err,
        });
      }
      return Models.RickAndMorty.count(search, (_err, count) =>
        res.json({
          msg: "Retrieve all Ricky and Morty Docs",
          data,
          count,
        })
      );
    });
  }
);

module.exports = router;
