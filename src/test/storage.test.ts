import { describe, expect, it } from 'vitest'
import { createBlankWeekProgress } from '../lib/progress'
import { createEmptyData, createExport, loadLocalData, mergeData, parseDataExport, saveLocalData } from '../lib/storage'

class MemoryStorage {
  private values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
}

describe('guest persistence', () => {
  it('round-trips valid local guest data', () => {
    const storage = new MemoryStorage()
    const data = createEmptyData()
    data.weekProgress['week-1'] = createBlankWeekProgress('week-1', '2026-08-04T12:00:00.000Z')
    saveLocalData(data, 'test', storage)
    expect(loadLocalData('test', storage)).toEqual(data)
  })

  it('falls back safely for corrupt browser data', () => {
    const storage = new MemoryStorage()
    storage.setItem('test', '{not-json')
    expect(loadLocalData('test', storage)).toEqual(createEmptyData())
  })

  it('merges newer guest work without discarding existing documents', () => {
    const base = createEmptyData()
    const incoming = createEmptyData()
    incoming.weekProgress['week-4'] = createBlankWeekProgress('week-4', '2026-08-04T12:00:00.000Z')
    expect(Object.keys(mergeData(base, incoming).weekProgress)).toEqual(['week-4'])
  })
})

describe('export and import validation', () => {
  it('accepts a versioned export', () => {
    const exported = createExport(createEmptyData(), '2026-08-04T12:00:00.000Z')
    expect(parseDataExport(JSON.stringify(exported))).toEqual(exported)
  })

  it('rejects malformed and incompatible backups helpfully', () => {
    expect(() => parseDataExport('not json')).toThrow('not valid JSON')
    expect(() => parseDataExport(JSON.stringify({ exportVersion: 99 }))).toThrow('invalid or incompatible')
  })
})
