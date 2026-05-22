import { useState } from 'react';

type ApplyParams = {
  jobId: string;
  file?: File | null;
  coverLetter?: string;
};

export default function useApplyForJob() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  async function apply(params: ApplyParams) {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tm_token') : null;
      const url = '/.netlify/functions/applyForJob';

      let res: Response;
      if (params.file) {
        const fd = new FormData();
        fd.append('jobId', params.jobId);
        // backend will expect a file field for the cover letter; use 'coverLetter' to match JSON fallback
        fd.append('coverLetterFile', params.file, params.file.name);

        res = await fetch(url, {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          body: fd,
        });
      } else {
        res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ jobId: params.jobId, coverLetter: params.coverLetter ?? '' }),
        });
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error || data?.message || 'Failed to submit application';
        throw new Error(msg);
      }

      setResult(data);
      return data;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return { apply, loading, error, result } as const;
}
