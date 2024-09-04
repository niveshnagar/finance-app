const { Router } = require("express");

const { User, Account } = require("../../db");
const userAuthMiddleware = require("../../middlewares/user/userAuth.middleware");

const router = Router();

// Route - Endpoint to get balance of a signed in user.
router.get("/balance", userAuthMiddleware, async (req, res) => {
  try {
    const username = req.username;
    const user = await User.findOne({ username });
    const userId = user._id;

    const accountInfo = await Account.findOne({ userId });
    const balance = accountInfo.balance;

    res.json({
      message: "Request successful",
      balance,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Oops something went wrong!",
    });
  }
});

// Route -
router.post("/transfer", userAuthMiddleware, (req, res) => {
  try {
    
  } catch (error) {
    return res.status(500).json({
      message: "Oops something went wrong!",
    });
  }
});

module.exports = router;
