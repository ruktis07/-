'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import styles from './search.module.css'

interface ResultItem {
  item100Code?: string // 誤記のため削除
  itemCode?: string
  itemName?: string
  expectedQuantity?: number
  gapLength?: number | string
  gapWidth?: number | string
  gapHeight?: number | string
  outerLength?: number | string
  outerWidth?: number | string
  outer100Height?: number | string // 誤記のため削除
  outerHeight?: number | string
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
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' // 誤記のため削除
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  }

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme)

  // OSテーマ変更検知
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => { // 誤記のため修正
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
      setResult(Array.isArray(data) ? data : [data])
    } catch (error) {
      setResult([{ error: "バックエンドとの通信に失敗しました" }])
    } finally {
      setIsSubmitting(false)
    }
  }

  // 値が空やundefinedの場合に「-」を表示するヘルパー関数
  const formatValue = (value: any) => value !== undefined && value !== '' ? value : '-'

  return (
    <div className={styles.container}>
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button
                type="submit"
                className={styles.button}
                disabled={isSubmitting}
              >
                {isSubmitting ? '検索中...' : '探してみる！'}
              </button>
              {isSubmitting && <div className={styles.inlineSpinner} />}
            </div>
          </form>
        </div>
        {/* 結果エリア（常に表示） */}
        <div className={styles.resultArea}>
          <h2 className={styles.resultTitle}>
            {isSubmitting ? '検索中...' : result.length === 0 ? "見つからなかった…" : "見つかった！"}
          </h2>
          <div className={styles.resultBox}>
            {isSubmitting ? (
              <p className={styles.noResult}>検索中...</p>
            ) : result.length === 0 ? (
              <p className={styles.noResult}>見つからなかった…</p>
            ) : (
              result.map((item, index) => (
                <div key={index} className={styles.resultItem}>
                  {item.error ? (
                    <p className={styles.error}>{item.error}</p>
                  ) : (
                    <table className={styles.table}>
                      <tbody>
                        {item.itemCode !== undefined && (
                          <tr>
                            <th>品目コード</th>
                            <td>{formatValue(item.itemCode)}</td>
                          </tr>
                        )}
                        {item.itemName !== undefined && (
                          <tr>
                            <th>品目名</th>
                            <td>{formatValue(item.itemName)}</td>
                          </tr>
                        )}
                        {(item.outerLength !== undefined || item.outerWidth !== undefined || item.outerHeight !== undefined) && (
                          <tr>
                            <th>外箱サイズ</th>
                            <td>{formatValue(item.outerLength)} × {formatValue(item.outerWidth)} × {formatValue(item.outerHeight)} mm</td>
                          </tr>
                        )}
                        {item.expectedQuantity !== undefined && (
                          <tr>
                            <th>入る個数</th>
                            <td>{formatValue(item.expectedQuantity)}個</td>
                          </tr>
                        )}
                        {item.gapLength !== undefined && (
                          <tr>
                            <th>隙間（長辺）</th>
                            <td>{formatValue(item.gapLength)}mm</td>
                          </tr>
                        )}
                        {item.gapWidth !== undefined && (
                          <tr>
                            <th>隙間（短辺）</th>
                            <td>{formatValue(item.gapWidth)}mm</td>
                          </tr>
                        )}
                        {item.gapHeight !== undefined && (
                          <tr>
                            <th>隙間（高さ）</th>
                            <td>{formatValue(item.gapHeight)}mm</td>
                          </tr>
                        )}
                        {item.gapHeight !== undefined && item.gapLength !== undefined && item.gapWidth !== undefined && (
                          <tr>
                            <th>挿入方向</th>
                            <td>{Number(item.gapHeight) > Math.min(Number(item.gapLength), Number(item.gapWidth)) ? '縦入れ' : '横入れ'}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
