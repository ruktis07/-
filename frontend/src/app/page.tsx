// app/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    router.push('/search')
  }

  return (
    <div>
      <h1>ログイン</h1>
      {error && <p style={{color: 'red'}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">ログイン</button>
      </form>
    </div>
  )
}
