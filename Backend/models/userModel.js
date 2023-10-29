import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = mongoose.Schema({
  studentId: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: false,
  },
  profilePicture: {
    type: String,
    required: false,
  },
});

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
});

export const User = mongoose.model("User", userSchema);
