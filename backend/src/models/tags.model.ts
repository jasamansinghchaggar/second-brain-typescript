import mongoose, { Schema, Document } from 'mongoose';

export interface ITag extends Document {
  title: string;
}

const tagSchema: Schema = new Schema({
  title: { type: String, required: true, unique: true }
});


export default mongoose.model<ITag>('Tag', tagSchema);
