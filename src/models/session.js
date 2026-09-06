import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true }, // власник сесії
    accessToken: { type: String, required: true }, // короткоживучий токен
    refreshToken: { type: String, required: true }, // довшоживучий токен
    accessTokenValidUntil: { type: Date, required: true }, // коли accessToken спливає
    refreshTokenValidUntil: { type: Date, required: true }, // коли refreshToken спливає
  },
  { timestamps: true, versionKey: false },
);

export const Session = model('Session', sessionSchema);
