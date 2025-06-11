'use client'

import { useState } from 'react'
import styles from './search.module.css'

export default function SearchPage() {
  const [form, setForm] = useState({
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
  }>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setResult({
      category: form.category,
      itemCode: form.itemCode,
      expectedQuantity: 10,
      gapLength: form.gapLength,
      gapWidth: form.gapWidth,
      gapHeight: form.gapHeight,
    })
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>外箱けんさくん</h1>
      <div className={styles.layout}>
        <div className={styles.inputArea}>
          <form onSubmit={handleSubmit} className={styles.form}>
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
            <h3 className={styles.subtitle}>寸法</h3>
            <div className={styles.dimensionGroup}>
              <div className={styles.formGroup}>
                <label className={styles.label}>長辺</label>
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
                <label className={styles.label}>短辺</label>
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
                <label className={styles.label}>高さ</label>
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
            <h3 className={styles.subtitle}>隙間</h3>
            <div className={styles.dimensionGroup}>
              <div className={styles.formGroup}>
                <label className={styles.label}>長辺</label>
                <input
                  type="number"
                  name="gapLength"
                  value={form.gapLength}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>短辺</label>
                <input
                  type="number"
                  name="gapWidth"
                  value={form.gapWidth}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>高さ</label>
                <input
                  type="number"
                  name="gapHeight"
                  value={form.gapHeight}
                  onChange={handleChange}
                  className={styles.input}
                  required
                />
              </div>
            </div>
          </form>
          <button
            type="button"
            className={styles.button}
            onClick={handleSubmit}
          >
            検索
          </button>
        </div>
        <div className={styles.resultArea}>
          <h2 className={styles.resultTitle}>検索結果</h2>
          <div className={styles.resultBox}>
            {result.category && <p className={styles.resultItem}>区分: {result.category}</p>}
            {result.itemCode && <p className={styles.resultItem}>品目コード: {result.itemCode}</p>}
            {result.expectedQuantity && <p className={styles.resultItem}>想定入数: {result.expectedQuantity}</p>}
            {result.gapLength && <p className={styles.resultItem}>隙間（長辺）: {result.gapLength}</p>}
            {result.gapWidth && <p className={styles.resultItem}>隙間（短辺）: {result.gapWidth}</p>}
            {result.gapHeight && <p className={styles.resultItem}>隙間（高さ）: {result.gapHeight}</p>}
            {!result.category && !result.itemCode && (
              <p className={styles.noResult}>検索結果がありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
