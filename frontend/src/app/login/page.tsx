'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function LoginPage() {
  const [id, setId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // テスト用：IDとパスワードが両方空欄ならログイン許可
    if (id === '' && password === '') {
      router.push('/search')
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: id, password }),
      })

      // レスポンスがJSONかどうかチェック
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('サーバーから無効なレスポンスが返されました')
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.msg || 'ログインに失敗しました')
      }

      // JWTをローカルストレージに保存（例）
      localStorage.setItem('token', data.access_token)
      router.push('/search')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'ログインに失敗しました')
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ログイン</h1>
      {error && <p className={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="ID"
          className={styles.input}
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <input
          type="password"
          placeholder="パスワード"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className={styles.button}>
          ログイン
        </button>
      </form>
    </div>
  )
}
