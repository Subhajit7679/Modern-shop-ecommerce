const crypto = require("crypto");
const transporter = require("../config/mail");
const { toTitleCase, validateEmail } = require("../config/function");
const bcrypt = require("bcryptjs");
const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

class Auth {
  async isAdmin(req, res) {
    let { loggedInUserId } = req.body;
    try {
      let loggedInUserRole = await userModel.findById(loggedInUserId);
      res.json({ role: loggedInUserRole.userRole });
    } catch {
      res.status(404);
    }
  }

  async allUser(req, res) {
    try {
      let allUser = await userModel.find({});
      res.json({ users: allUser });
    } catch {
      res.status(404);
    }
  }

  /* User Registration/Signup controller  */
  async postSignup(req, res) {
    let { name, email, password, cPassword } = req.body;
    let error = {};
    if (!name || !email || !password || !cPassword) {
      error = {
        ...error,
        name: "Filed must not be empty",
        email: "Filed must not be empty",
        password: "Filed must not be empty",
        cPassword: "Filed must not be empty",
      };
      return res.json({ error });
    }
    if (name.length < 3 || name.length > 25) {
      error = { ...error, name: "Name must be 3-25 charecter" };
      return res.json({ error });
    } else {
      if (validateEmail(email)) {
        name = toTitleCase(name);
        if ((password.length > 255) | (password.length < 8)) {
          error = {
            ...error,
            password: "Password must be 8 charecter",
            name: "",
            email: "",
          };
          return res.json({ error });
        } else {
          // If Email & Number exists in Database then:
          try {
            password = bcrypt.hashSync(password, 10);
            const data = await userModel.findOne({ email: email });
            if (data) {
              error = {
                ...error,
                password: "",
                name: "",
                email: "Email already exists",
              };
              return res.json({ error });
            } else {
              let newUser = new userModel({
                name,
                email,
                password,
                // ========= Here role 1 for admin signup role 0 for customer signup =========
                userRole: 0, // Field Name change to userRole from role
              });
              newUser
                .save()
                .then((data) => {
                  return res.json({
                    success: "Account create successfully. Please login",
                  });
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        error = {
          ...error,
          password: "",
          name: "",
          email: "Email is not valid",
        };
        return res.json({ error });
      }
    }
  }

  /* User Login/Signin controller  */
  async postSignin(req, res) {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.json({
        error: "Fields must not be empty",
      });
    }
    try {
      const data = await userModel.findOne({ email: email });
      if (!data) {
        return res.json({
          error: "Invalid email or password",
        });
      } else {
        const login = await bcrypt.compare(password, data.password);
        if (login) {
          const token = jwt.sign(
            {
              _id: data._id,

              name: data.name,

              email: data.email,

              role: data.userRole,
            },

            JWT_SECRET,
          );

          const encode = jwt.verify(token, JWT_SECRET);

          return res.json({
            token: token,

            user: encode,
          });
        } else {
          return res.json({
            error: "Invalid email or password",
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  async forgotPassword(req, res) {
try {
const { email } = req.body;


console.log("EMAIL RECEIVED:", email);

const user = await userModel.findOne({
  email,
});

console.log(
  "USER FOUND:",
  user?.email
);

if (!user) {
  return res.json({
    success: false,
    message: "User not found",
  });
}

const resetToken = jwt.sign(
  {
    id: user._id,
  },
  JWT_SECRET,
  {
    expiresIn: "15m",
  }
);

user.resetPasswordToken =
  resetToken;

user.resetPasswordExpire =
  Date.now() +
  15 * 60 * 1000;

await user.save();

const resetUrl =
  `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

console.log(
  "SENDING EMAIL..."
);

await transporter.sendMail({
  from:
    process.env.EMAIL_USER,

  to: user.email,

  subject:
    "Reset Your Password",

  html: `
    <h2>Password Reset</h2>

    <p>
      Click below to reset your password
    </p>

    <a href="${resetUrl}">
      Reset Password
    </a>
  `,
});

console.log(
  "EMAIL SENT SUCCESSFULLY"
);

return res.json({
  success: true,
  message:
    "Reset link sent to email",
});


} catch (error) {
console.log(
"FORGOT PASSWORD ERROR:"
);


console.log(error);

return res.json({
  success: false,
  message:
    error.message,
});


}
}


  async resetPassword(req, res) {
    try {
      const { token, password } = req.body;

      const decoded = jwt.verify(token, JWT_SECRET);

      const user = await userModel.findById(decoded.id);

      if (!user || user.resetPasswordToken !== token) {
        return res.json({
          success: false,
          message: "Invalid token",
        });
      }

      if (user.resetPasswordExpire < Date.now()) {
        return res.json({
          success: false,
          message: "Token expired",
        });
      }

      user.password = bcrypt.hashSync(password, 10);

      user.resetPasswordToken = null;

      user.resetPasswordExpire = null;

      await user.save();

      return res.json({
        success: true,
        message: "Password updated successfully",
      });
    } catch (error) {
      console.log(error);

      return res.json({
        success: false,
        message: "Invalid token",
      });
    }
  }
}

const authController = new Auth();
module.exports = authController;
