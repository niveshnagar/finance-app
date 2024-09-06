const mongoose = require("mongoose");
const z = require("zod");
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

    const senderAccountInfo = await Account.findOne({ userId });
    const balance = senderAccountInfo.balance;

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
router.post("/transfer", userAuthMiddleware, async (req, res) => {
  try {
    const transactionBodySchema = z.object({
      receiverId: z
        .string()
        .trim()
        .min(1)
        .refine((id) => mongoose.Types.ObjectId.isValid(id), {
          message: "Invalid receiverId. Must be a valid ObjectId.",
        }),
      amount: z.number(),
    });

    // create a session
    const session = await mongoose.startSession();

    // start the transaction
    session.startTransaction();

    // 1. Make sure the payload has correct inputs

    const result = transactionBodySchema.safeParse(req.body);
    if (!result.success) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid data format",
      });
    }

    const { receiverId, amount } = req.body;

    // 2. Make sure the receiverId's account exists

    const receiverAccountInfo = await Account.findOne({
      userId: receiverId,
    }).session(session);

    if (!receiverAccountInfo) {
      return res.status(400).json({
        message: "Invalid receiver's account info.",
      });
    }

    // 3. Make sure the sender's account has enough money

    // Fetch the info if the user has sufficient balance
    const senderInfo = await User.findOne({ username: req.username }).session(
      session
    );
    const senderId = senderInfo._id;

    const senderAccountInfo = await Account.findOne({
      userId: senderId,
    }).session(session);
    const accountBalance = senderAccountInfo.balance;

    if (!senderAccountInfo || accountBalance < amount) {
      // abort the transaction if the user does not have suffiecient funds
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance.",
      });
    }

    // Transfering the funds

    // Deduct the amount from the sender
    const updatedSender = await Account.findOneAndUpdate(
      { userId: senderId },
      { $inc: { balance: -amount } }
    ).session(session);

    // Add the amount to the receiverId's account
    const updatedReceiver = await Account.findOneAndUpdate(
      { userId: receiverId },
      { $inc: { balance: amount } }
    ).session(session);

    // commit the transaction
    session.commitTransaction();
    res.status(200).json({
      message: "Transfer successful.",
    });
  } catch (error) {
    console.log("error: ", error);

    return res.status(500).json({
      message: "Oops something went wrong!1",
    });
  }
});

module.exports = router;
