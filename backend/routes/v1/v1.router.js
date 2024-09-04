const { Router } = require("express");

const userRouter = require("./user.router");
const accountRouter = require("./account.router");

const router = Router();

// Add endpoints to router here...
router.use("/user", userRouter);
router.use("/account", accountRouter);

module.exports = router;
