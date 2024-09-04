const { Router } = require("express");
const userRouter = require("./user.router");

const router = Router();

// Add endpoints to router here...
router.use("/user", userRouter);

module.exports = router;
