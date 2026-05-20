import path from 'path';
import mammoth from 'mammoth';
import { AppError } from '../../utils/app-error';

function normalizeExtractedText(text: string) {
  return text
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function assertUsefulText(text: string) {
  const normalized = normalizeExtractedText(text);

  if (!normalized || normalized.length < 50) {
    throw new AppError('Resume text could not be extracted clearly', 422);
  }

  return normalized;
}

async function parsePdfBuffer(buffer: Buffer): Promise<string> {
  const pdfParseModule = await import('pdf-parse');

  const pdfParse =
    (pdfParseModule as any).default ||
    (pdfParseModule as any).pdfParse ||
    pdfParseModule;

  const parsed = await pdfParse(buffer);

  return parsed.text || '';
}

export async function extractResumeText(file: Express.Multer.File): Promise<string> {
  const extension = path.extname(file.originalname).toLowerCase();

  if (!file.buffer || file.buffer.length === 0) {
    throw new AppError('Uploaded file is empty or invalid', 400);
  }

  if (file.mimetype === 'application/pdf' || extension === '.pdf') {
    const text = await parsePdfBuffer(file.buffer);
    return assertUsefulText(text);
  }

  if (
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    extension === '.docx'
  ) {
    const parsed = await mammoth.extractRawText({ buffer: file.buffer });
    return assertUsefulText(parsed.value || '');
  }

  if (file.mimetype === 'application/msword' || extension === '.doc') {
    throw new AppError(
      'DOC parsing is not supported yet. Please upload PDF or DOCX for AI matching.',
      422
    );
  }

  throw new AppError('Unsupported resume file type', 400);
}