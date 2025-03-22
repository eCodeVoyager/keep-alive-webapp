const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      select: false,
    },
    avatar: {
      type: String,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    website_offline_alert: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "premium"],
      default: "user",
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: null,
    },
    notificationPreferences: {
      email: {
        enabled: { type: Boolean, default: true },
        frequency: {
          type: String,
          enum: ["instant", "daily", "weekly"],
          default: "instant",
        },
      },
      sms: {
        enabled: { type: Boolean, default: false },
        frequency: {
          type: String,
          enum: ["instant", "daily", "weekly"],
          default: "instant",
        },
      },
      inApp: {
        enabled: { type: Boolean, default: true },
      },
    },
    refreshToken: {
      type: String,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      select: false,
    },
    oauth: {
      google: {
        id: { type: String, sparse: true, index: true },
        email: String,
        name: String,
        picture: String,
        token: { type: String, select: false },
      },
      github: {
        id: { type: String, sparse: true, index: true },
        email: String,
        name: String,
        picture: String,
        token: { type: String, select: false },
      },
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    accountType: {
      type: String,
      enum: ["free", "premium"],
      default: "free",
    },
    apiKeys: [
      {
        key: {
          type: String,
          default: () => uuidv4(),
        },
        name: String,
        permissions: [String],
        createdAt: {
          type: Date,
          default: Date.now,
        },
        lastUsed: Date,
      },
    ],
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    accountLocked: {
      type: Boolean,
      default: false,
    },
    accountLockedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Plugins
userSchema.plugin(mongoosePaginate);

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ "oauth.google.id": 1 });
userSchema.index({ "oauth.github.id": 1 });
userSchema.index({ "apiKeys.key": 1 });

// Virtual fields (not stored in database)
userSchema.virtual("fullName").get(function () {
  return `${this.name}`;
});

userSchema.virtual("isOAuthUser").get(function () {
  return !!(this.oauth?.google?.id || this.oauth?.github?.id);
});

// Pre-save middleware for password hashing
userSchema.pre("save", async function (next) {
  // Only hash the password if it's been modified or is new
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Methods
userSchema.methods.isPasswordMatch = async function (password) {
  // If user has no password (OAuth user), return false
  if (!this.password) return false;

  return await bcrypt.compare(password, this.password);
};

userSchema.methods.changePassword = async function (oldPassword, newPassword) {
  // If user has no password (OAuth user), we need to handle differently
  if (!this.password) {
    // For OAuth users, we can add a password without the old password check
    this.password = newPassword;
    await this.save();
    return true;
  }

  const isValid = await this.isPasswordMatch(oldPassword);
  if (!isValid) {
    return false;
  }

  this.password = newPassword;
  await this.save();
  return true;
};

userSchema.methods.createApiKey = async function (
  name,
  permissions = ["read"]
) {
  const apiKey = {
    key: uuidv4(),
    name,
    permissions,
    createdAt: new Date(),
  };

  this.apiKeys.push(apiKey);
  await this.save();
  return apiKey;
};

userSchema.methods.getApiKeys = function () {
  return this.apiKeys || [];
};

userSchema.methods.deleteApiKey = async function (keyId) {
  this.apiKeys = this.apiKeys.filter((key) => key.key !== keyId);
  await this.save();
};

userSchema.methods.recordLoginSuccess = async function () {
  this.lastLogin = new Date();
  this.failedLoginAttempts = 0;
  this.accountLocked = false;
  this.accountLockedUntil = null;
  await this.save();
};

userSchema.methods.recordLoginFailure = async function () {
  this.failedLoginAttempts += 1;

  // Lock account after 5 failed attempts
  if (this.failedLoginAttempts >= 5) {
    this.accountLocked = true;
    // Lock for 15 minutes
    this.accountLockedUntil = new Date(Date.now() + 15 * 60 * 1000);
  }

  await this.save();
};

userSchema.methods.isAccountLocked = function () {
  if (!this.accountLocked) return false;

  // Check if lock period has expired
  if (this.accountLockedUntil && this.accountLockedUntil < new Date()) {
    return false;
  }

  return true;
};

module.exports = mongoose.model("User", userSchema);
