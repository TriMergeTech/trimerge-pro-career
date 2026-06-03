import { useCallback, useState } from 'react'

type GetJobsParams = {
  page?: number
  limit?: number
  status?: 'OPEN' | 'CLOSED' | 'DRAFT' | string
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | string
  location?: string
  search?: string
}

export const useGetPublicJobs = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = useCallback(async (params: GetJobsParams = {}) => {
    setLoading(true)
    setError(null)

    try {
      const qs = new URLSearchParams()
      if (params.page !== undefined) qs.append('page', String(params.page))
      if (params.limit !== undefined) qs.append('limit', String(params.limit))
      if (params.status) qs.append('status', String(params.status))
      if (params.employmentType) qs.append('employmentType', String(params.employmentType))
      if (params.location) qs.append('location', params.location)
      if (params.search) qs.append('search', params.search)

      const url = `/.netlify/functions/getJobsPublic${qs.toString() ? `?${qs.toString()}` : ''}`

      const response = await fetch(url, { method: 'GET' })
      const raw = await response.text()
      let data: unknown = raw

      try {
        data = raw ? JSON.parse(raw) : {}
      } catch {
        // keep raw text
      }

      if (!response.ok) {
        let message = 'Failed to fetch public jobs'
        if (data && typeof data === 'object') {
          const obj = data as Record<string, unknown>
          if (typeof obj.error === 'string') message = obj.error
          else if (typeof obj.message === 'string') message = obj.message
        } else if (typeof data === 'string' && data.trim().length > 0) {
          message = data
        }

        setError(message)
        return null
      }

      return data
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      setError(message)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { fetchJobs, loading, error, setError } as const
}
