import { useState } from 'react'

type GetJobsParams = {
  page?: number 
  limit?: number
  status?: 'OPEN' | 'CLOSED' | 'DRAFT' | string
  employmentType?: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | string
  location?: string
  search?: string
}

export const useGetJobs = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async (params: GetJobsParams = {}) => {
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

      const url = `/.netlify/functions/getJobs${qs.toString() ? `?${qs.toString()}` : ''}`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('tm_token')}`,
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      if (!response.ok) {
        const message = data?.error || data?.message || 'Failed to fetch jobs'
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
  }

  return { fetchJobs, loading, error, setError } as const
}
