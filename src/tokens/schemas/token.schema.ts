import * as mongoose from 'mongoose';

export const TokenSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      requiered: true,
    },
  },
  {
    timestamps: true,
  },
);
