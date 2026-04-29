import { Document, Types } from 'mongoose';

export interface Bookmark {
  candidateId: Types.ObjectId;
  jobId: Types.ObjectId;
}

export interface BookmarkDocument extends Bookmark, Document {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}