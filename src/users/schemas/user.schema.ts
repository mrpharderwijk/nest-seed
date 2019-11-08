import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema(
  {
    emailAddress: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    isValidated: {
      type: Boolean,
      default: false,
      required: true,
    },
    name: {
      firstName: {
        type: String,
        required: true,
        trim: true,
      },
      middleName: {
        type: String,
        required: false,
        trim: true,
      },
      lastName: {
        type: String,
        required: true,
        trim: true,
      },
    },
  },
  {
    timestamps: true,
  },
);
