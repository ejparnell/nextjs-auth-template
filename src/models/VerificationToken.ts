import { Schema, model, models, type Model, type Types } from 'mongoose';

export type TokenKind = 'email' | 'password';

export interface VerificationTokenDoc {
    _id: Types.ObjectId;
    userId: Types.ObjectId;
    tokenHash: string;
    kind: TokenKind;
    expiresAt: Date;
}

const verificationTokenSchema = new Schema<VerificationTokenDoc>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        tokenHash: { type: String, required: true },
        kind: { type: String, enum: ['email', 'password'], required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

export const VerificationToken: Model<VerificationTokenDoc> =
    (models.VerificationToken as Model<VerificationTokenDoc> | undefined) ??
    model<VerificationTokenDoc>('VerificationToken', verificationTokenSchema);
