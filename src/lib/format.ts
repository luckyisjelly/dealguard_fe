import type { AlertSeverity } from '../types/api'

export const formatPrice = (value: number) => `${value.toLocaleString('ko-KR')}원`

export const formatDate = (value?: string) => {
  if (!value) return '미확인'
  return value.replace('T', ' ').slice(0, 16)
}

export const severityLabel = (severity: AlertSeverity) => severity

export const alertTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    LISTING_CHAT_MISMATCH: '게시글과 채팅 내용 불일치',
    CONDITION_CHANGED: '거래 조건 변경',
    MISSING_CONDITION: '거래 조건 누락',
    AMBIGUOUS_EXPRESSION: '모호한 표현',
    RISKY_PAYMENT: '위험 결제 패턴',
    PRICE_EXTRACTED: '가격 추출',
    TRADE_METHOD_DETECTED: '거래 방식 감지',
  }
  return labels[type] ?? type
}
