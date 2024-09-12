const { Router } = require("express");
const jwt = require("jsonwebtoken");
const z = require("zod");

const { User, Account } = require("../../db");
const { jwtSecret, saltRounds } = require("../../config");
const { hashPassword, comparePassword } = require("../../utils/authUtils");
const userAuthMiddleware = require("../../middlewares/user/userAuth.middleware");

const router = Router();

// TODO - refactor into controllers

// Add endpoints to router here...
router.post("/signup", async (req, res) => {
  try {
    const signupSchema = z.object({
      username: z
        .string()
        .min(1, "Username must be at least 1 character long")
        .max(50, "Username cannot exceed 50 characters")
        .trim()
        .toLowerCase(),

      password: z.string().min(1, "Password must be at least 1 character long"),

      firstName: z
        .string()
        .min(1, "First name must be at least 1 character long")
        .max(50, "First name cannot exceed 50 characters")
        .trim(),

      lastName: z
        .string()
        .min(1, "Last name must be at least 1 character long")
        .max(50, "Last name cannot exceed 50 characters")
        .trim(),
    });

    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data format",
      });
    }

    const { username, password, firstName, lastName } = result.data;

    // hash the password before saving it to database
    const hashedPassword = await hashPassword(password);

    try {
      const user = await User.create({
        username,
        password: hashedPassword,
        firstName,
        lastName,
      });

      const userId = user._id;

      // when a new user signs up initialise their balance with 100000
      const accountDetails = await Account.create({
        userId,
        balance: 10000000,
      });

      res.json({
        message: "User registered successfully",
        username,
      });
    } catch (error) {
      console.log("error while signing up: ", error.code);

      if (error.code === 11000) {
        return res.status(400).json({
          message: "User already exists, please sign-in",
        });
      }

      // for all other error codes
      res.status(400).json({
        message: "Failed to register the username",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Oops something went wrong!",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const signinSchema = z.object({
      username: z
        .string()
        .min(1, "Username must be at least 1 character long")
        .max(50, "Username cannot exceed 50 characters")
        .trim()
        .toLowerCase(),

      password: z.string().min(1, "Password must be at least 1 character long"),
    });

    const result = signinSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data format",
      });
    }

    const { username, password } = result.data;
    const user = await User.findOne({ username });

    // check if the user for given username exists
    if (!user) {
      return res.status(403).json({
        message: "Invalid credentials.",
      });
    }

    // check if the password is correct or not
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return res.status(403).json({
        message: "Invalid credentials.",
      });
    }

    // TODO - handle jwt token options ex. expiresIn and refreshing tokens etc.
    const token = jwt.sign({ username }, jwtSecret, { expiresIn: "1h" });
    res.json({
      message: "sign-in successful.",
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Oops something went wrong!",
    });
  }
});

router.put("/updateuser", userAuthMiddleware, async (req, res) => {
  try {
    // define schema for put request
    const userInfoSchema = z.object({
      firstName: z
        .string()
        .max(50, "First name cannot exceed 50 characters")
        .trim()
        .optional(),
      lastName: z
        .string()
        .max(50, "First name cannot exceed 50 characters")
        .trim()
        .optional(),
      password: z.string().optional(),
    });

    // validate the request body against the schema
    const result = userInfoSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "Invalid data format",
      });
    }

    // Dynamically construct update query only with provided fields
    const updateQuery = {};
    if (result.data.firstName !== undefined) {
      updateQuery.firstName = result.data.firstName;
    }
    if (result.data.lastName !== undefined) {
      updateQuery.lastName = result.data.lastName;
    }
    if (result.data.password !== undefined) {
      updateQuery.password = await hashPassword(
        result.data.password,
        saltRounds
      );
    }

    // if nothing to update early return
    if (!Object.keys(updateQuery).length) {
      return res.json({ message: "No changes made" });
    }

    // update the user info in the database
    const username = req.username;
    const updatedUser = await User.updateOne({ username }, updateQuery);

    // TODO - if the password is updated figure out how to decommision older JWT tokens
    // - token blacklisting might be a solution but this is a major disadvantage for JWT(s)
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Oops something went wrong.",
    });
  }
});

router.get("/list", userAuthMiddleware, async (req, res) => {
  try {
    const queryParam = req.query.filter || "";
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: queryParam,
          },
        },
        {
          lastName: {
            $regex: queryParam,
          },
        },
      ],
    });

    res.json({
      users: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        userId: user._id,
      })),
    });
  } catch (error) {
    res.status(500).json({
      message: "Oops something went wrong!",
    });
  }
});

router.get("/userId", userAuthMiddleware, async (req, res) => {
  try {
    const userId = req.query.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({
        message: "User does not exist.",
      });
    }
    const { firstName, lastName, id } = user;
    res.status(200).json({
      message: "User found.",
      user: { firstName, lastName, id },
    });
  } catch (error) {
    res.status(500).json({
      message: "Oops something went wrong!",
    });
  }
});

module.exports = router;
