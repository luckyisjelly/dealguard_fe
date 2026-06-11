import type { Alert, AnalysisSummary, ConditionChange, Conversation, EvidencePackage, Message, ProductPost, User } from '../types/api'

export const mockUser: User = {
  id: 1,
  email: 'user@example.com',
  nickname: '홍길동',
  role: 'USER',
  createdAt: '2026-05-23T10:00:00',
  lastLoginAt: '2026-05-24T09:30:00',
}

export const mockProducts: ProductPost[] = [
  {
    id: 1,
    title: '아이폰 13',
    category: '디지털기기',
    description: '아이폰 13 판매합니다. 생활기스 조금 있고 작동은 정상입니다.',
    listedPrice: 150000,
    conditionDescription: '생활기스 있음, 작동 정상',
    defectDescription: '모서리 생활기스 외 큰 하자 없음',
    refundPolicyText: '단순 변심 환불 불가',
    tradeLocationText: '홍대입구역',
    deliveryAvailable: true,
    tradeMethod: '직거래 또는 택배',
    createdAt: '2026-05-23',
  },
  {
    id: 2,
    title: '맥북 에어',
    category: '디지털기기',
    description: '상태 좋은 맥북 에어입니다.',
    listedPrice: 650000,
    conditionDescription: '상태 좋음',
    refundPolicyText: '협의 필요',
    tradeLocationText: '강남역',
    deliveryAvailable: false,
    tradeMethod: '직거래',
    createdAt: '2026-05-22',
  },
  {
    id: 3,
    title: '소니 카메라',
    category: '디지털기기',
    description: '거의 새 제품입니다.',
    listedPrice: 320000,
    conditionDescription: '거의 새거',
    refundPolicyText: '환불 불가',
    tradeLocationText: '합정역',
    deliveryAvailable: true,
    tradeMethod: '택배 가능',
    createdAt: '2026-05-20',
  },
  {
    id: 4,
    title: '아이패드 미니',
    category: '디지털기기',
    description: '사용감 있는 아이패드 미니입니다.',
    listedPrice: 280000,
    conditionDescription: '사용감 있음',
    refundPolicyText: '교환 불가',
    tradeLocationText: '신촌역',
    deliveryAvailable: true,
    tradeMethod: '직거래 또는 택배',
    createdAt: '2026-05-19',
  },
  {
    id: 5,
    title: '무선 헤드폰',
    category: '디지털기기',
    description: '작동 정상입니다.',
    listedPrice: 90000,
    conditionDescription: '작동 정상',
    refundPolicyText: '환불 어려움',
    tradeLocationText: '왕십리역',
    deliveryAvailable: true,
    tradeMethod: '택배 가능',
    createdAt: '2026-05-18',
  },
]

export const mockConversations: Conversation[] = [
  {
    id: 1,
    title: '아이폰 13 거래',
    productPostId: 1,
    productTitle: '아이폰 13',
    status: 'ACTIVE',
    messageCount: 5,
    lastAnalyzedAt: '2026-05-23T18:20:00',
    updatedAt: '2026-05-23',
    alertSummary: 'HIGH 1, MEDIUM 2',
    analysisStatus: 'DONE',
  },
  {
    id: 2,
    title: '노트북 직거래',
    productPostId: 2,
    productTitle: '맥북 에어',
    status: 'ACTIVE',
    messageCount: 12,
    lastAnalyzedAt: '2026-05-22T11:15:00',
    updatedAt: '2026-05-22',
    alertSummary: 'MEDIUM 1',
    analysisStatus: 'DONE',
  },
  {
    id: 3,
    title: '카메라 택배거래',
    productPostId: 3,
    productTitle: '소니 카메라',
    status: 'CLOSED',
    messageCount: 9,
    lastAnalyzedAt: '2026-05-20T16:40:00',
    updatedAt: '2026-05-20',
    alertSummary: '없음',
    analysisStatus: 'DONE',
  },
  {
    id: 4,
    title: '태블릿 반값택배',
    productPostId: 4,
    productTitle: '아이패드 미니',
    status: 'ACTIVE',
    messageCount: 7,
    updatedAt: '2026-05-19',
    alertSummary: '미분석',
    analysisStatus: 'NEEDED',
  },
  {
    id: 5,
    title: '헤드폰 거래',
    productPostId: 5,
    productTitle: '무선 헤드폰',
    status: 'CLOSED',
    messageCount: 6,
    lastAnalyzedAt: '2026-05-18T15:20:00',
    updatedAt: '2026-05-18',
    alertSummary: 'LOW 1',
    analysisStatus: 'DONE',
  },
]

export const mockMessages: Message[] = [
  { id: 1, conversationId: 1, senderType: 'SELLER', sentAt: '18:10', content: '아이폰 13 판매합니다. 생활기스 조금 있고 작동은 정상이에요.' },
  { id: 2, conversationId: 1, senderType: 'BUYER', sentAt: '18:12', content: '가격 15만원 맞나요? 홍대입구역 직거래 가능할까요?' },
  { id: 3, conversationId: 1, senderType: 'SELLER', sentAt: '18:13', content: '네 직거래 가능해요. 그런데 17만원이면 바로 드릴게요.' },
  { id: 4, conversationId: 1, senderType: 'BUYER', sentAt: '18:15', content: '계좌이체로 결제해도 될까요? 환불은 가능한가요?' },
  { id: 5, conversationId: 1, senderType: 'SELLER', sentAt: '18:16', content: '환불은 좀 어려워요. 상태는 거의 새거예요.' },
]

export const mockAlerts: Alert[] = [
  {
    id: 1,
    severity: 'HIGH',
    type: 'LISTING_CHAT_MISMATCH',
    item: '가격',
    description: '게시글 가격과 채팅 가격이 다릅니다',
    beforeValue: '150,000원',
    afterValue: '170,000원',
    relatedMessage: '메시지 3',
    resolved: false,
  },
  {
    id: 2,
    severity: 'MEDIUM',
    type: 'AMBIGUOUS_EXPRESSION',
    item: '환불 정책',
    description: '환불 가능 여부가 명확하지 않습니다',
    afterValue: '환불은 좀 어려움',
    relatedMessage: '메시지 5',
    resolved: false,
  },
  {
    id: 3,
    severity: 'MEDIUM',
    type: 'AMBIGUOUS_EXPRESSION',
    item: '상품 상태',
    description: '"거의 새거"는 구체적인 상태 설명이 아닙니다',
    afterValue: '거의 새거',
    relatedMessage: '메시지 5',
    resolved: false,
  },
  {
    id: 4,
    severity: 'LOW',
    type: 'MISSING_CONDITION',
    item: '거래 시간',
    description: '거래 시간이 아직 확정되지 않았습니다',
    afterValue: '미확인',
    resolved: false,
  },
]

export const mockAnalysis: AnalysisSummary = {
  status: '완료',
  confidenceScore: 62,
  analyzedAt: '2026-05-23T18:20:00',
  conditions: {
    가격: '170,000원',
    '거래 장소': '홍대입구역',
    '거래 시간': '미확인',
    '거래 방식': '직거래',
    '결제 방식': '계좌이체',
    '상품 상태': '거의 새거',
    '하자 정보': '생활기스 있음',
    '환불 정책': '환불은 좀 어려움',
    '네고 정책': '미확인',
    구성품: '미확인',
  },
  alerts: mockAlerts,
}

export const mockChanges: ConditionChange[] = [
  { id: 1, analyzedAt: '2026-05-23T18:13:00', field: '가격', beforeValue: '150,000원', afterValue: '170,000원', severity: 'HIGH', relatedMessage: '메시지 3' },
  { id: 2, analyzedAt: '2026-05-23T18:15:00', field: '결제 방식', beforeValue: '미확인', afterValue: '계좌이체', severity: 'LOW', relatedMessage: '메시지 4' },
  { id: 3, analyzedAt: '2026-05-23T18:16:00', field: '환불 정책', beforeValue: '미확인', afterValue: '환불은 좀 어려움', severity: 'MEDIUM', relatedMessage: '메시지 5' },
  { id: 4, analyzedAt: '2026-05-23T18:16:00', field: '상품 상태', beforeValue: '생활기스 있음', afterValue: '거의 새거', severity: 'MEDIUM', relatedMessage: '메시지 5' },
]

export const mockEvidencePackages: EvidencePackage[] = [
  { id: 1, fileName: '아이폰13_거래증거_20260523.pdf', conversationTitle: '아이폰 13 거래', createdAt: '2026-05-23T18:25:00', hash: 'a8f3...91c2' },
  { id: 2, fileName: '맥북에어_거래증거_20260522.pdf', conversationTitle: '노트북 직거래', createdAt: '2026-05-22T11:15:00', hash: '7bd1...44ea' },
  { id: 3, fileName: '소니카메라_거래증거_20260520.pdf', conversationTitle: '카메라 택배거래', createdAt: '2026-05-20T16:40:00', hash: '2fc9...8b10' },
]

export const chatTranscriptSample = `SELLER 18:10  아이폰 13 판매합니다. 생활기스 조금 있고 작동은 정상이에요.
BUYER 18:12  가격 15만원 맞나요? 홍대입구역 직거래 가능할까요?
SELLER 18:13  네 직거래 가능해요. 그런데 17만원이면 바로 드릴게요.
BUYER 18:15  계좌이체로 결제해도 될까요? 환불은 가능한가요?
SELLER 18:16  환불은 좀 어려워요. 상태는 거의 새거예요.`
