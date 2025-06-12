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

  // OSテーマ初期値取得
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  // OSテーマ変更検知
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleChange as EventListener)
    return () => mediaQuery.removeEventListener('change', handleChange as EventListener)
  }, [theme])

  // 入力変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("サーバーエラー")
      const data = await res.json()
      // バックエンドから配列で返ってくる想定
      setResult(Array.isArray(data) ? data : [data])
    } catch (error) {
      setResult([{ error: "バックエンドとの通信に失敗しました" }])
    } finally {
      setIsSubmitting(false)
    }
  }

  // 結果エリア表示条件
  const shouldShowResult = result.length > 0 || (result.length === 1 && result[0].error)

  return (
    <div className={styles.container}>
      {/* Now Loadingオーバーレイ（検索中のみ表示） */}
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner} />
        </div>
      )}

      {/* タイトル＋画像 */}
      <h1 className={styles.title}>
        外箱けんさくん
        <Image
          src="/kensaku_man.png"
          alt="外箱けんさくんアイコン"
          width={40}
          height={40}
        />
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

            {/* 既存モード：品目コードのみ */}
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

            {/* 新規モード：寸法のみ */}
            {form.mode === 'new' && (
              <>
                <h3 className={styles.subtitle}>箱の大きさは？</h3>
                <div className={styles.dimensionGroup}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>長辺（一番長いとこ）<small>（mm）</small></label>
                    <input
                      type="number"
                      name="sizeLength"
                      value={form.sizeLength}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>短辺（短いとこ）<small>（mm）</small></label>
                    <input
                      type="number"
                      name="sizeWidth"
                      value={form.sizeWidth}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>高さ（上から見た高さ）<small>（mm）</small></label>
                    <input
                      type="number"
                      name="sizeHeight"
                      value={form.sizeHeight}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* 隙間：どちらのモードでも表示 */}
            <h3 className={styles.subtitle}>隙間はどれくらい？</h3>
            <div className={styles.dimensionGroup}>
              <div className={styles.formGroup}>
                <label className={styles.label}>長辺の隙間<small>（mm、空欄で30）</small></label>
                <input
                  type="number"
                  name="gapLength"
                  value={form.gapLength}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>短辺の隙間<small>（mm、空欄で30）</small></label>
                <input
                  type="number"
                  name="gapWidth"
                  value={form.gapWidth}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>高さの隙間<small>（mm、空欄で30）</small></label>
                <input
                  type="number"
                  name="gapHeight"
                  value={form.gapHeight}
                  onChange={handleChange}
                  className={styles.input}
                />
              </div>
            </div>
            <button
              type="submit"
              className={styles.button}
              disabled={isSubmitting}
            >
              {isSubmitting ? '検索中...' : '探してみる！'}
            </button>
          </form>
        </div>

        {/* 結果エリア（常に同じサイズで表示） */}
        <div className={styles.resultArea}>
          {shouldShowResult ? (
            <>
              <h2 className={styles.resultTitle}>
                {result.length === 0 ? "見つからなかった…" : "見つかった！"}
              </h2>
              <div className={styles.resultBox}>
                {result.length === 0 ? (
                  <p className={styles.noResult}>見つからなかった…</p>
                ) : (
                  result.map((item, index) => (
                    <div key={index} className={styles.resultItem}>
                      {item.error ? (
                        <p className={styles.error}>{item.error}</p>
                      ) : (
                        <>
                          {item.itemCode && <p>品目コード: {item.itemCode}</p>}
                          {item.itemName && <p>品目名: {item.itemName}</p>}
                          {item.expectedQuantity && <p>入るかな？: {item.expectedQuantity}個</p>}
                          {item.gapLength !== undefined && <p>隙間（長辺）: {item.gapLength}mm</p>}
                          {item.gapWidth !== undefined && <p>隙間（短辺）: {item.gapWidth}mm</p>}
                          {item.gapHeight !== undefined && <p>隙間（高さ）: {item.gapHeight}mm</p>}
                        </>
                      )}
                    </div>
                  ))
                )}
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
