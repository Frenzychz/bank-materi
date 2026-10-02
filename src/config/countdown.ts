export interface CountdownConfig {
  tkaDate: string // Format YYYY-MM-DDTHH:mm:ss
  tkaLabel: string
  utbkDate: string
  utbkLabel: string
}

export const DEFAULT_COUNTDOWN_CONFIG: CountdownConfig = {
  tkaDate: '2026-10-26T07:00:00',
  tkaLabel: 'TKA 2026',
  utbkDate: '2027-04-21T07:00:00',
  utbkLabel: 'UTBK-SNBT 2027',
}
