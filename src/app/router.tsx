import { Navigate, createBrowserRouter } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'
import { AuthLayout } from '../components/layout/AuthLayout'
import { ProtectedRoute } from '../components/layout/ProtectedRoute'
import { authStore } from '../lib/auth'
import { LoginPage } from '../features/auth/LoginPage'
import { SignupPage } from '../features/auth/SignupPage'
import { DashboardPage } from '../features/dashboard/DashboardPage'
import { ProductListPage } from '../features/products/ProductListPage'
import { ProductFormPage } from '../features/products/ProductFormPage'
import { ProductDetailPage } from '../features/products/ProductDetailPage'
import { ConversationListPage } from '../features/conversations/ConversationListPage'
import { ConversationDetailPage } from '../features/conversations/ConversationDetailPage'
import { MessagesPage } from '../features/messages/MessagesPage'
import { AnalysisPage } from '../features/analysis/AnalysisPage'
import { HistoryPage } from '../features/analysis/HistoryPage'
import { EvidencePage } from '../features/evidence/EvidencePage'
import { MePage } from '../features/me/MePage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to={authStore.isAuthenticated() ? '/dashboard' : '/login'} replace />,
  },
  {
    element: <AuthLayout mode="login" />,
    children: [{ path: '/login', element: <LoginPage /> }],
  },
  {
    element: <AuthLayout mode="signup" />,
    children: [{ path: '/signup', element: <SignupPage /> }],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/dashboard', element: <DashboardPage />, handle: { title: '대시보드' } },
          { path: '/products', element: <ProductListPage />, handle: { title: '상품 게시글 목록' } },
          { path: '/products/new', element: <ProductFormPage />, handle: { title: '상품 게시글 등록' } },
          { path: '/products/:productId', element: <ProductDetailPage />, handle: { title: '상품 게시글 상세' } },
          { path: '/products/:productId/edit', element: <ProductFormPage />, handle: { title: '상품 게시글 수정' } },
          { path: '/conversations', element: <ConversationListPage />, handle: { title: '거래 대화 목록' } },
          { path: '/conversations/:conversationId', element: <ConversationDetailPage />, handle: { title: '거래 대화 상세' } },
          { path: '/conversations/:conversationId/messages', element: <MessagesPage />, handle: { title: '채팅 붙여넣기' } },
          { path: '/conversations/:conversationId/analysis', element: <AnalysisPage />, handle: { title: '분석 결과' } },
          { path: '/conversations/:conversationId/history', element: <HistoryPage />, handle: { title: '조건 변경 이력' } },
          { path: '/conversations/:conversationId/evidence', element: <EvidencePage />, handle: { title: '증거 패키지' } },
          { path: '/me', element: <MePage />, handle: { title: '내 정보' } },
        ],
      },
    ],
  },
])
