import { FormEvent, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, Lock, Mail, User } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { Input } from '../../components/ui/Input'
import { api } from '../../lib/api'
import { authStore } from '../../lib/auth'

export function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', nickname: '', password: '', passwordConfirm: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError('올바른 이메일을 입력해주세요.')
    if (!form.nickname.trim()) return setError('닉네임을 입력해주세요.')
    if (form.password.length < 8) return setError('비밀번호는 8자 이상으로 입력해주세요.')
    if (form.password !== form.passwordConfirm) return setError('비밀번호 확인이 일치하지 않습니다.')

    try {
      setLoading(true)
      const result = await api.signup({ email: form.email, nickname: form.nickname, password: form.password })
      authStore.setTokens(result.accessToken, result.refreshToken)
      navigate('/dashboard')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : '회원가입에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="mx-auto w-full max-w-[660px] p-10">
      <h1 className="text-4xl font-bold">회원가입</h1>
      <p className="mt-4 text-lg text-zinc-600">DealGuard에서 중고거래 조건을 안전하게 기록하고 분석하세요.</p>
      <form onSubmit={submit} className="mt-7 space-y-5">
        <Field icon={Mail} label="이메일" value={form.email} placeholder="user@example.com" onChange={(value) => setForm({ ...form, email: value })} />
        <Field icon={User} label="닉네임" value={form.nickname} placeholder="홍길동" onChange={(value) => setForm({ ...form, nickname: value })} />
        <Field icon={Lock} label="비밀번호" type="password" value={form.password} placeholder="8자 이상 입력하세요" onChange={(value) => setForm({ ...form, password: value })} rightIcon />
        <Field icon={Lock} label="비밀번호 확인" type="password" value={form.passwordConfirm} placeholder="비밀번호를 다시 입력하세요" onChange={(value) => setForm({ ...form, passwordConfirm: value })} rightIcon />
        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
        <Button className="h-14 w-full text-base" variant="primary" disabled={loading}>{loading ? '회원가입 중' : '회원가입'}</Button>
      </form>
      <p className="mx-auto mt-5 max-w-md text-center text-zinc-500">회원가입 후 상품 게시글, 거래 대화, 분석 결과, 증거 패키지를 관리할 수 있습니다.</p>
      <div className="mt-8 border-t border-zinc-200 pt-7 text-center">
        <span className="text-zinc-500">이미 계정이 있으신가요?</span>
        <Link className="ml-10 font-bold underline" to="/login">로그인</Link>
      </div>
    </Card>
  )
}

function Field({ icon: Icon, label, value, onChange, placeholder, type = 'text', rightIcon = false }: { icon: LucideIcon; label: string; value: string; onChange: (value: string) => void; placeholder: string; type?: string; rightIcon?: boolean }) {
  return (
    <label className="block">
      <span className="mb-2 block font-semibold">{label}</span>
      <div className="relative">
        <Icon className="absolute left-4 top-3 h-5 w-5 text-zinc-500" />
        <Input className="pl-12 pr-12" type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
        {rightIcon && <Eye className="absolute right-4 top-3 h-5 w-5 text-zinc-500" />}
      </div>
    </label>
  )
}
