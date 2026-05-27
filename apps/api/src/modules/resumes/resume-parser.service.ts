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
  const pdfParseModule: any = await import('pdf-parse');

  const callableParser =
    typeof pdfParseModule === 'function'
      ? pdfParseModule
      : typeof pdfParseModule.default === 'function'
        ? pdfParseModule.default
        : typeof pdfParseModule.pdfParse === 'function'
          ? pdfParseModule.pdfParse
          : null;

  if (callableParser) {
    const parsed = await callableParser(buffer);
    return parsed?.text || '';
  }

  const PDFParseClass =
    typeof pdfParseModule.PDFParse === 'function'
      ? pdfParseModule.PDFParse
      : typeof pdfParseModule.default?.PDFParse === 'function'
        ? pdfParseModule.default.PDFParse
        : null;

  if (PDFParseClass) {
    const parser = new PDFParseClass({ data: buffer });

    try {
      if (typeof parser.getText === 'function') {
        const result = await parser.getText();
        return result?.text || '';
      }

      throw new AppError('PDF parser does not support getText()', 500);
    } finally {
      if (typeof parser.destroy === 'function') {
        await parser.destroy();
      }
    }
  }

  throw new AppError('PDF parser is not available', 500);
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
      'DOC parsing is not supported. Please upload PDF or DOCX for AI matching.',
      422
    );
  }

  throw new AppError('Unsupported resume file type', 400);
}