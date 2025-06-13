'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './search.module.css'

interface ResultItem {
  itemCode?: string
  itemName?: string
  expectedQuantity?: number
  gapLength?: string
  gapWidth?: string
  gapHeight?: string
  orientation?: '縦入れ' | '横入れ'
  outerLength?: number
  outerWidth?: number
  outerHeight?: number
  error?: string
}

export default function SearchPage() {
  const [form, setForm] = useState({
    mode: 'existing',
    itemCode: '',
    sizeLength: '',
    sizeWidth: '',
    sizeHeight: '',
    gapLength: '',
    gapWidth: '',
    gapHeight: '',
  })

  const [result, setResult] = useState<ResultItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleChange as EventListener)
    return () => mediaQuery.removeEventListener('change', handleChange as EventListener)
  }, [theme])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("サーバーエラー")
      const data = await res.json()
      setResult(Array.isArray(data) ? data : [data])
    } catch {
      setResult([{ error: "バックエンドとの通信に失敗しました" }])
    } finally {
      setIsSubmitting(false)
    }
  }

  const shouldShowResult = result.length > 0 || (result.length === 1 && result[0].error)

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        外箱けんさくん
        <Image src="/kensaku_man.png" alt="外箱けんさくんアイコン" width={40} height={40} />
      </h1>

      <div className={styles.layout}>
        <div className={styles.inputArea}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="existing"
                  checked={form.mode === 'existing'}
                  onChange={handleChange}
                /> 既存のやつで探す
              </label>
              <label>
                <input
                  type="radio"
                  name="mode"
                  value="new"
                  checked={form.mode === 'new'}
                  onChange={handleChange}
                /> 新しく作るやつで探す
              </label>
            </div>

            {form.mode === 'existing' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>品目コード</label>
                <input
                  type="text"
                  name="itemCode"
                  value={form.itemCode}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            )}

            {form.mode === 'new' && (
              <>
                <h3 className={styles.subtitle}>箱の大きさは？</h3>
                <div className={styles.dimensionRow}>
                  <input
                    type="number"
                    name="sizeLength"
                    value={form.sizeLength}
                    onChange={handleChange}
                    className={styles.input}
                    required
                    placeholder="長辺"
                  />
                  <span className={styles.dimensionTimes}>×</span>
                  <input
                    type="number"
                    name="sizeWidth"
                    value={form.sizeWidth}
                    onChange={handleChange}
                    className={styles.input}
                    required
                    placeholder="短辺"
                  />
                  <span className={styles.dimensionTimes}>×</span>
                  <input
                    type="number"
                    name="sizeHeight"
                    value={form.sizeHeight}
                    onChange={handleChange}
                    className={styles.input}
                    required
                    placeholder="高さ"
                  />
                  <span className={styles.dimensionUnit}>mm</span>
                </div>
              </>
            )}

            <h3 className={styles.subtitle}>隙間はどれくらい？</h3>
            <div className={styles.dimensionGroup}>
              <div className={styles.formGroup}>
                <label className={styles.label}>長辺の隙間<small>（mm、空欄で30）</small></label>
                <input type="number" name="gapLength" value={form.gapLength} onChange={handleChange} className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>短辺の隙間<small>（mm、空欄で30）</small></label>
                <input type="number" name="gapWidth" value={form.gapWidth} onChange={handleChange} className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>高さの隙間<small>（mm、空欄で30）</small></label>
                <input type="number" name="gapHeight" value={form.gapHeight} onChange={handleChange} className={styles.input} />
              </div>
            </div>

            <div className={styles.buttonRow}>
              <button type="submit" className={styles.button} disabled={isSubmitting}>
                探してみる！
              </button>
              {isSubmitting && <div className={styles.inlineSpinner} />}
            </div>
          </form>
        </div>

        <div className={styles.resultArea}>
          {shouldShowResult ? (
            <>
              <h2 className={styles.resultTitle}>見つかった！</h2>
              <div className={styles.resultBox}>
                {result.map((item, index) => (
  <div key={index} className={styles.resultRow}>
    {item.error ? (
      <span className={styles.error}>{item.error}</span>
    ) : (
      <table className={styles.resultTable}>
        <tbody>
          {item.itemCode && (
            <tr>
              <th>品目コード</th>
              <td>{item.itemCode}</td>
            </tr>
          )}
          {item.itemName && (
            <tr>
              <th>品目名</th>
              <td>{item.itemName}</td>
            </tr>
          )}
          {item.expectedQuantity !== undefined && (
            <tr>
              <th>梱包数</th>
              <td>{item.expectedQuantity}個</td>
            </tr>
          )}
          {item.gapLength && (
            <tr>
              <th>隙間（長辺）</th>
              <td>{item.gapLength}mm</td>
            </tr>
          )}
          {item.gapWidth && (
            <tr>
              <th>隙間（短辺）</th>
              <td>{item.gapWidth}mm</td>
            </tr>
          )}
          {item.gapHeight && (
            <tr>
              <th>隙間（高さ）</th>
              <td>{item.gapHeight}mm</td>
            </tr>
          )}
          {item.outerLength && item.outerWidth && item.outerHeight && (
            <tr>
              <th>サイズ</th>
              <td>{item.outerLength} × {item.outerWidth} × {item.outerHeight} mm</td>
            </tr>
          )}
          {item.orientation && (
            <tr>
              <th>向き</th>
              <td>{item.orientation}</td>
            </tr>
          )}
        </tbody>
      </table>
    )}
  </div>
))}

              </div>
            </>
          ) : (
            <div className={styles.resultBox}>
              <p className={styles.noResult}>検索結果がありません</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
