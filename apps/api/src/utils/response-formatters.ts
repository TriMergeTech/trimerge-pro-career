function toId(value: any): string | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'object') {
    if (typeof value._id !== 'undefined') {
      return toId(value._id);
    }

    if (typeof value.toString === 'function') {
      const stringValue = value.toString();
      if (stringValue && stringValue !== '[object Object]') {
        return stringValue;
      }
    }
  }

  return String(value);
}

function toPlainObject<T extends Record<string, any>>(value: T | null | undefined): T | null {
  if (!value) {
    return null;
  }

  if (typeof (value as any).toObject === 'function') {
    return (value as any).toObject({ getters: false, virtuals: false });
  }

  return value;
}

export function formatJob(job: any) {
  const plainJob = toPlainObject(job);

  if (!plainJob) {
    return null;
  }

  const id = toId(plainJob._id ?? plainJob.id);

  return {
    ...plainJob,
    _id: id,
    id,
    employerId: toId(plainJob.employerId),
    createdAt: plainJob.createdAt,
    updatedAt: plainJob.updatedAt,
    skills: Array.isArray(plainJob.skills) ? plainJob.skills : [],
  };
}

export function formatApplication(application: any) {
  const plainApplication = toPlainObject(application);

  if (!plainApplication) {
    return null;
  }

  const id = toId(plainApplication._id ?? plainApplication.id);

  return {
    ...plainApplication,
    _id: id,
    id,
    jobId: toId(plainApplication.jobId),
    candidateId: toId(plainApplication.candidateId),
    createdAt: plainApplication.createdAt,
    updatedAt: plainApplication.updatedAt,
  };
}
