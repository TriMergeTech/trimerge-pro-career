export const handler = async (event: unknown) => {
  const ev = event as {
    httpMethod?: string;
    headers?: Record<string, string | undefined>;
    queryStringParameters?: Record<string, string | undefined>;
    rawQuery?: string;
  };

  if (ev.httpMethod !== 'GET') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const token = ev.headers?.authorization?.replace?.('Bearer ', '') || '';

  const qs = ev.queryStringParameters ?? {};

  const allowedStatus = new Set(['OPEN', 'CLOSED', 'DRAFT']);
  const allowedEmployment = new Set(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']);

  const params = new URLSearchParams();

  if (qs.page) params.append('page', qs.page);
  if (qs.limit) params.append('limit', qs.limit);

  if (qs.status) {
    const s = qs.status.toUpperCase();
    if (allowedStatus.has(s)) params.append('status', s);
  }

  if (qs.employmentType) {
    const e = qs.employmentType.toUpperCase();
    if (allowedEmployment.has(e)) params.append('employmentType', e);
  }

  if (qs.location) params.append('location', qs.location);
  if (qs.search) params.append('search', qs.search);

  const url = `${process.env.BASEURL}/api/v1/jobs${params.toString() ? `?${params.toString()}` : ''}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || data?.error || 'Failed to fetch jobs');
    }

    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (err: unknown) {
    console.log('getJobs error:', err);
    const message = err instanceof Error ? err.message : String(err);
    return { statusCode: 500, body: JSON.stringify({ error: message }) };
  }
};
