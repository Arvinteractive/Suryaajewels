import { createContext, useContext } from 'react'
import en from './en'
import hi from './hi'
import ta from './ta'

// Order here is the order the switch renders in.
export const LANGUAGES = [en, hi, ta]
export const DICTS = { en, hi, ta }
export const STORAGE_KEY = 'suryaa.lang'

export const LanguageContext = createContext(null)

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}

// Sugar for the common case — a component that only reads copy.
export function useT() {
  return useLang().t
}
