import mongoose, { Schema, Document, Types } from "mongoose";

export const contentTypes = ["image", "video", "article", "audio", "doc", "link"] as const;

export interface IContent extends Document {
  link: string;
  type: (typeof contentTypes)[number];
  title: string;
  tags: Types.ObjectId[];
  userId: Types.ObjectId;
}

const ContentSchema: Schema = new Schema(
  {
    link: { type: String, required: true },
    type: { type: String, enum: contentTypes, required: true },
    title: { type: String, required: true },
    tags: [{ type: Types.ObjectId, ref: "Tag" }],
    userId: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContent>("Content", ContentSchema);
