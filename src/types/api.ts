export type ApiEnvelope<T> = {
  success: boolean
  data: T
  message?: string
}

export type User = {
  id: number
  email: string
  nickname: string
  role: string
  createdAt: string
  updatedAt?: string
  lastLoginAt?: string
}

export type ProductPost = {
  id: number
  ownerUserId?: number
  title: string
  category: string
  description: string
  listedPrice: number
  conditionDescription: string
  defectDescription?: string
  refundPolicyText?: string
  tradeLocationText?: string
  deliveryAvailable: boolean
  tradeMethod?: string
  createdAt?: string
  updatedAt?: string
}

export type Conversation = {
  id: number
  productPostId?: number
  ownerUserId?: number
  title: string
  productTitle: string
  status: 'ACTIVE' | 'CLOSED'
  messageCount: number
  lastAnalyzedAt?: string
  createdAt?: string
  updatedAt: string
  alertSummary: string
  analysisStatus: 'DONE' | 'NEEDED' | 'PENDING'
}

export type Message = {
  id: number
  conversationId: number
  senderType: 'SELLER' | 'BUYER' | 'SYSTEM'
  senderRole?: 'SELLER' | 'BUYER' | 'SYSTEM'
  sentAt: string
  content: string
  sequence?: number
  createdAt?: string
}

export type AlertSeverity = 'HIGH' | 'MEDIUM' | 'LOW'

export type Alert = {
  id: number
  severity: AlertSeverity
  type: string
  item: string
  description: string
  beforeValue?: string
  afterValue?: string
  relatedMessage?: string
  resolved: boolean
  createdAt?: string
}

export type AnalysisSummary = {
  status: '완료' | '대기' | '실패'
  confidenceScore: number
  analyzedAt: string
  conditions: Record<string, string>
  alerts: Alert[]
}

export type ConditionChange = {
  id: number
  analyzedAt: string
  field: string
  beforeValue: string
  afterValue: string
  severity: AlertSeverity
  relatedMessage: string
}

export type EvidencePackage = {
  id: number
  conversationId?: number
  fileName: string
  conversationTitle: string
  createdAt: string
  hash: string
}
