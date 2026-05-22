import { useEffect, useState } from 'react'
import { useRefreshToken } from './useAuth'

export const useGetEmployer = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<unknown>(null)
  const { refresh } = useRefreshToken()

  useEffect(() => {
    let mounted = true

    const load = async () => {
      if (!mounted) return
      setLoading(true)
      setError(null)
      try {
        const token = localStorage.getItem('tm_token')
        const res = await fetch('/.netlify/functions/getEmployer', {
          method: 'GET',
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        })

        const payload = await res.json().catch(() => ({}))
        if (res.ok) {
          if (!mounted) return
          const employer = payload.employer ?? payload
          setData(employer)
          return
        }

        // If unauthorized try refresh and retry once
        if (res.status === 401) {
          const refreshed = await refresh()
          if (refreshed) {
            const retry = await fetch('/.netlify/functions/getEmployer', {
              method: 'GET',
              headers: { Authorization: `Bearer ${localStorage.getItem('tm_token')}` },
            })
            const retryData = await retry.json().catch(() => ({}))
            if (retry.ok) {
              if (!mounted) return
              const employer = retryData.employer ?? retryData
              setData(employer)
              return
            }
          }
        }

        if (!mounted) return
        setError(payload?.message || payload?.error || 'Failed to fetch employer')
      } catch (err: unknown) {
        if (!mounted) return
        setError(err instanceof Error ? err.message : String(err))
      } finally {
        if (!mounted) return
        setLoading(false)
      }
    }

    load()
    return () => { mounted = false }
  }, [refresh])

  return { loading, error, setError, data } as const
}

export default useGetEmployer
