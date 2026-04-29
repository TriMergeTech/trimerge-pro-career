import { Schema, model } from 'mongoose';
import { BookmarkDocument } from './bookmark.types';

const bookmarkSchema = new Schema<BookmarkDocument>(
  {
    candidateId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
  },
  { timestamps: true }
);

bookmarkSchema.index({ candidateId: 1, jobId: 1 }, { unique: true });
bookmarkSchema.index({ candidateId: 1, createdAt: -1 });

export const BookmarkModel = model<BookmarkDocument>('Bookmark', bookmarkSchema);