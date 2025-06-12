'use client'

import { useState, useEffect } from 'react'
import styles from './search.module.css'

export default function SearchPage() {
  // 初期値は既存
  const [form, setForm] = useState({
    mode: 'existing',
    category: '',
    itemCode: '',
    sizeLength: '',
    sizeWidth: '',
    sizeHeight: '',
    gapLength: '',
    gapWidth: '',
    gapHeight: '',
  })

  const [result, setResult] = useState<{
    category?: string
    itemCode?: string
    expectedQuantity?: number
    gapLength?: string
    gapWidth?: string
    gapHeight?: string
    error?: string
  }>({})

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
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/serch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("サーバーエラー");
      const data = await res.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "バックエンドとの通信に失敗しました" });
    }
  };


  return (
    <div className={styles.container}>
      <h1 className={styles.title}>外箱けんさくん</h1>
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

            {/* 既存モード：区分・品目コードのみ */}
            {form.mode === 'existing' && (
              <>
                <div className={styles.formGroup}>
                  <label className={styles.label}>区分</label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className={styles.input}
                    required
                  />
                </div>
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
              </>
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
            <button type="submit" className={styles.button}>
              探してみる！
            </button>
          </form>
        </div>
        <div className={styles.resultArea}>
          <h2 className={styles.resultTitle}>見つかった！</h2>
          <div className={styles.resultBox}>
            {result.category && <p className={styles.resultItem}>区分: {result.category}</p>}
            {result.itemCode && <p className={styles.resultItem}>品目コード: {result.itemCode}</p>}
            {result.expectedQuantity && <p className={styles.resultItem}>入るかな？: {result.expectedQuantity}個</p>}
            {result.gapLength && <p className={styles.resultItem}>隙間（長辺）: {result.gapLength}mm</p>}
            {result.gapWidth && <p className={styles.resultItem}>隙間（短辺）: {result.gapWidth}mm</p>}
            {result.gapHeight && <p className={styles.resultItem}>隙間（高さ）: {result.gapHeight}mm</p>}
            {!result.category && !result.itemCode && (
              <p className={styles.noResult}>見つからなかった…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
