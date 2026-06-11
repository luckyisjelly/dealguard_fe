import { authStore } from './auth'
import { formatPrice } from './format'
import { mockAlerts, mockAnalysis, mockChanges, mockConversations, mockEvidencePackages, mockMessages, mockProducts, mockUser } from './mockData'
import type { Alert, AlertSeverity, AnalysisSummary, ApiEnvelope, ConditionChange, Conversation, EvidencePackage, Message, ProductPost, User } from '../types/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
const ENABLE_MOCKS = import.meta.env.VITE_ENABLE_MOCKS !== 'false'

type AuthResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

type ConversationResponse = {
  id: number
  productPostId: number
  ownerUserId: number
  title: string
  status: 'ACTIVE' | 'CLOSED'
  createdAt: string
  updatedAt: string
}

type MessageResponse = {
  id: number
  conversationId: number
  senderRole: 'BUYER' | 'SELLER' | 'SYSTEM'
  content: string
  sentAt: string
  sequence: number
  createdAt: string
}

type AnalysisAlertResponse = {
  id: number
  conversationId: number
  alertType: string
  severity: AlertSeverity
  fieldName?: string
  message?: string
  beforeValue?: string
  afterValue?: string
  sourceMessageIds?: string
  resolved: boolean
  createdAt: string
}

type TradeConditionSnapshotResponse = {
  id: number
  conversationId: number
  price?: number
  place?: string
  tradeTimeText?: string
  tradeMethod?: string
  deliveryFeePolicy?: string
  paymentMethod?: string
  productCondition?: string
  defectDetails?: string
  refundPolicy?: string
  negotiationPolicy?: string
  includedItems?: string
  confidenceScore?: number
  sourceMessageIds?: string
  createdAt: string
}

type AnalysisResultResponse = {
  summary?: TradeConditionSnapshotResponse
  alerts?: AnalysisAlertResponse[]
}

type EvidencePackageResponse = {
  id: number
  conversationId: number
  fileName: string
  sha256Hash: string
  generatedAt: string
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = authStore.getAccessToken()
  const headers = new Headers(options.headers)
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers })
  const text = await response.text()
  const json = text ? (JSON.parse(text) as ApiEnvelope<T> | T) : undefined

  if (response.status === 401) {
    authStore.clear()
    window.location.href = '/login'
    throw new Error(getApiMessage(json) ?? '인증이 만료되었습니다.')
  }
  if (!response.ok) throw new Error(getApiMessage(json) ?? 'API 요청에 실패했습니다.')

  if (typeof json === 'object' && json && 'success' in json) {
    const envelope = json as ApiEnvelope<T>
    if (!envelope.success) throw new Error(envelope.message ?? '요청 처리에 실패했습니다.')
    return envelope.data
  }
  return json as T
}

function getApiMessage<T>(json: ApiEnvelope<T> | T | undefined) {
  if (typeof json === 'object' && json && 'message' in json && typeof json.message === 'string') return json.message
  return undefined
}

function fallback<T>(promise: Promise<T>, value: T): Promise<T> {
  if (!ENABLE_MOCKS) return promise
  return promise.catch(() => value)
}

function mockable<T>(promise: Promise<T>, value: T): Promise<T> {
  return promise.catch((error) => {
    if (!ENABLE_MOCKS) throw error
    return value
  })
}

const unknown = (value?: string | number | null) => (value === undefined || value === null || value === '' ? '미확인' : String(value))

function normalizeConversation(item: ConversationResponse, product?: ProductPost): Conversation {
  return {
    ...item,
    productTitle: product?.title ?? `상품 #${item.productPostId}`,
    messageCount: 0,
    lastAnalyzedAt: undefined,
    alertSummary: '분석 전',
    analysisStatus: 'NEEDED',
  }
}

function normalizeMessage(item: MessageResponse): Message {
  return {
    id: item.id,
    conversationId: item.conversationId,
    senderType: item.senderRole,
    senderRole: item.senderRole,
    sentAt: item.sentAt,
    content: item.content,
    sequence: item.sequence,
    createdAt: item.createdAt,
  }
}

function normalizeAlert(item: AnalysisAlertResponse): Alert {
  return {
    id: item.id,
    severity: item.severity,
    type: item.alertType,
    item: item.fieldName ?? '거래 조건',
    description: item.message ?? '확인이 필요한 경고입니다.',
    beforeValue: item.beforeValue,
    afterValue: item.afterValue,
    relatedMessage: item.sourceMessageIds ? `메시지 ${item.sourceMessageIds}` : undefined,
    resolved: item.resolved,
    createdAt: item.createdAt,
  }
}

function snapshotToConditions(summary?: TradeConditionSnapshotResponse): Record<string, string> {
  return {
    가격: summary?.price ? formatPrice(summary.price) : '미확인',
    '거래 장소': unknown(summary?.place),
    '거래 시간': unknown(summary?.tradeTimeText),
    '거래 방식': tradeMethodLabel(summary?.tradeMethod),
    '배송비 정책': unknown(summary?.deliveryFeePolicy),
    '결제 방식': paymentMethodLabel(summary?.paymentMethod),
    '상품 상태': unknown(summary?.productCondition),
    '하자 정보': unknown(summary?.defectDetails),
    '환불 정책': unknown(summary?.refundPolicy),
    '네고 정책': unknown(summary?.negotiationPolicy),
    구성품: unknown(summary?.includedItems),
  }
}

function normalizeAnalysis(summary?: TradeConditionSnapshotResponse, alerts: AnalysisAlertResponse[] = []): AnalysisSummary {
  return {
    status: summary ? '완료' : '대기',
    confidenceScore: Math.round((summary?.confidenceScore ?? 0) * 100),
    analyzedAt: summary?.createdAt ?? new Date().toISOString(),
    conditions: snapshotToConditions(summary),
    alerts: alerts.map(normalizeAlert),
  }
}

function normalizeEvidence(item: EvidencePackageResponse, conversationTitle?: string): EvidencePackage {
  return {
    id: item.id,
    conversationId: item.conversationId,
    fileName: item.fileName,
    conversationTitle: conversationTitle ?? `대화 #${item.conversationId}`,
    createdAt: item.generatedAt,
    hash: item.sha256Hash,
  }
}

function snapshotsToChanges(snapshots: TradeConditionSnapshotResponse[]): ConditionChange[] {
  const sorted = [...snapshots].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  const fields: Array<[string, (item: TradeConditionSnapshotResponse) => string]> = [
    ['가격', (item) => (item.price ? formatPrice(item.price) : '미확인')],
    ['거래 장소', (item) => unknown(item.place)],
    ['거래 방식', (item) => tradeMethodLabel(item.tradeMethod)],
    ['결제 방식', (item) => paymentMethodLabel(item.paymentMethod)],
    ['환불 정책', (item) => unknown(item.refundPolicy)],
    ['상품 상태', (item) => unknown(item.productCondition)],
  ]
  const changes: ConditionChange[] = []

  for (let index = 1; index < sorted.length; index += 1) {
    for (const [field, getter] of fields) {
      const beforeValue = getter(sorted[index - 1])
      const afterValue = getter(sorted[index])
      if (beforeValue !== afterValue) {
        changes.push({
          id: Number(`${sorted[index].id}${changes.length}`),
          analyzedAt: sorted[index].createdAt,
          field,
          beforeValue,
          afterValue,
          severity: field === '가격' ? 'HIGH' : 'MEDIUM',
          relatedMessage: sorted[index].sourceMessageIds ? `메시지 ${sorted[index].sourceMessageIds}` : '-',
        })
      }
    }
  }

  return changes
}

function tradeMethodLabel(value?: string) {
  const labels: Record<string, string> = {
    DIRECT: '직거래',
    DELIVERY: '택배',
    HALF_DELIVERY: '반값택배',
    QUICK: '퀵',
    UNKNOWN: '미확인',
  }
  return labels[value ?? 'UNKNOWN'] ?? unknown(value)
}

function paymentMethodLabel(value?: string) {
  const labels: Record<string, string> = {
    CASH: '현금',
    BANK_TRANSFER: '계좌이체',
    SAFE_PAYMENT: '안전결제',
    UNKNOWN: '미확인',
  }
  return labels[value ?? 'UNKNOWN'] ?? unknown(value)
}

export const api = {
  login: (email: string, password: string) => mockable(
    request<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
    { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', user: mockUser },
  ),
  signup: (payload: { email: string; nickname: string; password: string }) => mockable(
    request<AuthResponse>('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
    { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token', user: { ...mockUser, email: payload.email, nickname: payload.nickname } },
  ),
  me: () => fallback(request<User>('/api/auth/me'), mockUser),
  products: () => fallback(request<ProductPost[]>('/api/product-posts'), mockProducts),
  product: (id: number) => fallback(request<ProductPost>(`/api/product-posts/${id}`), mockProducts.find((item) => item.id === id) ?? mockProducts[0]),
  createProduct: (payload: Partial<ProductPost>) => mockable(
    request<ProductPost>('/api/product-posts', { method: 'POST', body: JSON.stringify(payload) }),
    { ...mockProducts[0], ...payload, id: Date.now() },
  ),
  updateProduct: (id: number, payload: Partial<ProductPost>) => mockable(
    request<ProductPost>(`/api/product-posts/${id}`, { method: 'PATCH', body: JSON.stringify(payload) }),
    { ...mockProducts[0], ...payload, id },
  ),
  conversations: () => fallback(
    request<ConversationResponse[]>('/api/conversations').then((items) => items.map((item) => normalizeConversation(item))),
    mockConversations,
  ),
  conversation: (id: number) => fallback(
    request<ConversationResponse>(`/api/conversations/${id}`).then((item) => normalizeConversation(item)),
    mockConversations.find((item) => item.id === id) ?? mockConversations[0],
  ),
  createConversation: (payload: Partial<Conversation>) => mockable(
    request<ConversationResponse>('/api/conversations', {
      method: 'POST',
      body: JSON.stringify({ productPostId: payload.productPostId, title: payload.title }),
    }).then((item) => normalizeConversation(item)),
    { ...mockConversations[0], ...payload, id: Date.now() },
  ),
  messages: (conversationId: number) => fallback(
    request<MessageResponse[]>(`/api/conversations/${conversationId}/messages`).then((items) => items.map(normalizeMessage)),
    mockMessages.map((item) => ({ ...item, conversationId })),
  ),
  saveTranscript: (conversationId: number, transcript: string) => mockable(
    request<MessageResponse[]>(`/api/conversations/${conversationId}/messages/from-transcript`, {
      method: 'POST',
      body: JSON.stringify({ transcript }),
    }).then((items) => items.map(normalizeMessage)),
    mockMessages.map((item) => ({ ...item, conversationId })),
  ),
  analyze: (conversationId: number) => mockable(
    request<AnalysisResultResponse>(`/api/conversations/${conversationId}/analyze`, { method: 'POST' }).then((result) => normalizeAnalysis(result.summary, result.alerts)),
    mockAnalysis,
  ),
  analysis: (conversationId: number) => fallback(
    Promise.all([
      request<TradeConditionSnapshotResponse>(`/api/conversations/${conversationId}/summary`),
      request<AnalysisAlertResponse[]>(`/api/conversations/${conversationId}/alerts`),
    ]).then(([summary, alerts]) => normalizeAnalysis(summary, alerts)),
    mockAnalysis,
  ),
  alerts: (conversationId: number) => fallback(
    request<AnalysisAlertResponse[]>(`/api/conversations/${conversationId}/alerts`).then((items) => items.map(normalizeAlert)),
    mockAlerts,
  ),
  conditionHistory: (conversationId: number) => fallback(
    request<TradeConditionSnapshotResponse[]>(`/api/conversations/${conversationId}/condition-history`).then(snapshotsToChanges),
    mockChanges,
  ),
  evidencePackages: (conversationId: number) => fallback(
    request<EvidencePackageResponse[]>(`/api/conversations/${conversationId}/evidence-packages`).then((items) => items.map((item) => normalizeEvidence(item))),
    mockEvidencePackages,
  ),
  createEvidencePackage: (conversationId: number) => mockable(
    request<EvidencePackageResponse>(`/api/conversations/${conversationId}/evidence-packages`, { method: 'POST' }).then((item) => normalizeEvidence(item)),
    mockEvidencePackages[0],
  ),
  downloadEvidencePdf: async (id: number) => {
    const token = authStore.getAccessToken()
    const response = await fetch(`${API_BASE_URL}/api/evidence-packages/${id}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    })
    if (!response.ok) throw new Error('PDF 다운로드에 실패했습니다.')
    return response.blob()
  },
}
