import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, Lock, Mail } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { api } from '../../lib/api'
import { authStore } from '../../lib/auth'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('올바른 이메일을 입력해주세요.')
    if (!password) return setError('비밀번호를 입력해주세요.')

    try {
      setLoading(true)
      const result = await api.login(email, password)
      authStore.setTokens(result.accessToken, result.refreshToken)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-[640px] p-10">
      <h1 className="text-4xl font-bold">로그인</h1>
      <p className="mt-4 text-lg text-zinc-600">중고거래 조건을 기록하고 분쟁 위험을 미리 확인하세요.</p>
      <form onSubmit={submit} className="mt-9 space-y-6">
        <label className="block">
          <span className="mb-2 block font-semibold">이메일</span>
          <div className="relative">
            <Mail className="absolute left-4 top-3 h-5 w-5 text-zinc-500" />
            <Input className="pl-12" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@example.com" />
          </div>
        </label>
        <label className="block">
          <span className="mb-2 block font-semibold">비밀번호</span>
          <div className="relative">
            <Lock className="absolute left-4 top-3 h-5 w-5 text-zinc-500" />
            <Input className="pl-12 pr-12" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="비밀번호를 입력하세요" />
            <Eye className="absolute right-4 top-3 h-5 w-5 text-zinc-500" />
          </div>
        </label>
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <Button className="h-14 w-full text-base" variant="primary" disabled={loading}>{loading ? '로그인 중' : '로그인'}</Button>
      </form>
      <p className="mx-auto mt-5 max-w-md text-center text-zinc-500">로그인 후 상품 게시글, 거래 대화, 분석 결과, 증거 패키지를 관리할 수 있습니다.</p>
      <div className="mt-8 border-t border-zinc-200 pt-7 text-center">
        <span className="text-zinc-500">아직 계정이 없으신가요?</span>
        <Link className="ml-10 font-bold underline" to="/signup">회원가입</Link>
      </div>
    </Card>
  )
}
