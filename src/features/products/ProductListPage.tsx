import { MessageCircle, Package, Plus, RefreshCw, Truck, CheckCircle, TriangleAlert, FileText, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { StatCard } from '../../components/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { api } from '../../lib/api'
import { formatPrice } from '../../lib/format'

export function ProductListPage() {
  const { data: products = [] } = useQuery({ queryKey: ['products'], queryFn: api.products })
  const [category, setCategory] = useState('전체')
  const filtered = useMemo(() => products.filter((item) => category === '전체' || item.category === category), [products, category])

  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard icon={Package} label="전체 상품 수" value={products.length} />
        <StatCard icon={RefreshCw} label="거래 진행 중" value={5} />
        <StatCard icon={Truck} label="택배 가능 상품" value={products.filter((item) => item.deliveryAvailable).length} />
      </div>
      <PageGrid>
        <Card>
          <SectionHeader title="상품 게시글">
            <Link to="/products/new"><Button variant="primary">상품 등록</Button></Link>
          </SectionHeader>
          <div className="mb-6 flex flex-wrap items-end gap-8 rounded-lg border border-zinc-200 p-4">
            <Filter label="카테고리 필터" items={['전체', '디지털기기', '패션', '생활용품']} value={category} onChange={setCategory} />
            <Filter label="거래 방식 필터" items={['전체', '직거래', '택배 가능']} value="전체" onChange={() => undefined} />
            <label className="ml-auto block text-sm font-semibold">정렬<select className="mt-2 h-10 rounded-md border border-zinc-200 px-4"><option>최근 등록순</option></select></label>
          </div>
          <div className="overflow-x-auto rounded-lg border border-zinc-200">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-zinc-50">
                <tr>{['상품명', '카테고리', '등록 가격', '상품 상태', '환불 정책', '거래 위치', '택배 가능', '등록일', '상세 보기'].map((head) => <th key={head} className="px-4 py-4 text-left">{head}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id} className="border-t border-zinc-200">
                    <td className="px-4 py-4">{item.title}</td>
                    <td className="px-4 py-4">{item.category}</td>
                    <td className="px-4 py-4">{formatPrice(item.listedPrice)}</td>
                    <td className="px-4 py-4">{item.conditionDescription}</td>
                    <td className="px-4 py-4">{item.refundPolicyText}</td>
                    <td className="px-4 py-4">{item.tradeLocationText}</td>
                    <td className="px-4 py-4"><Badge>{item.deliveryAvailable ? '가능' : '불가'}</Badge></td>
                    <td className="px-4 py-4">{item.createdAt}</td>
                    <td className="px-4 py-4"><Link to={`/products/${item.id}`}><Button>보기</Button></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <aside className="space-y-6">
          <Card>
            <SectionHeader title="상품 관리" />
            <div className="space-y-3">
              <Link to="/products/new"><Button className="w-full justify-start"><Plus className="h-5 w-5" />새 상품 등록</Button></Link>
              <Link to="/conversations"><Button className="w-full justify-start"><MessageCircle className="h-5 w-5" />거래 대화 생성</Button></Link>
              <Link to="/conversations/1/analysis"><Button className="w-full justify-start"><Search className="h-5 w-5" />선택 상품 분석</Button></Link>
              <Link to="/conversations/1/evidence"><Button className="w-full justify-start"><FileText className="h-5 w-5" />증거 패키지 보기</Button></Link>
            </div>
          </Card>
          <Card>
            <SectionHeader title="게시글 품질 체크" />
            <Quality icon={CheckCircle} label="가격 입력 완료" value="12개" />
            <Quality icon={CheckCircle} label="상품 상태 입력 완료" value="10개" />
            <Quality icon={CheckCircle} label="환불 정책 입력 완료" value="8개" />
            <Quality icon={TriangleAlert} label="하자 설명 누락" value="3개" />
          </Card>
          <Card className="text-sm leading-6 text-zinc-600">상품 게시글 정보는 채팅 분석 결과와 비교되는 기준 데이터입니다. 가격, 환불 정책, 상품 상태를 명확히 입력할수록 분쟁 예방에 도움이 됩니다.</Card>
        </aside>
      </PageGrid>
    </div>
  )
}

function Filter({ label, items, value, onChange }: { label: string; items: string[]; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => <Button key={item} variant={value === item ? 'primary' : 'secondary'} onClick={() => onChange(item)}>{item}</Button>)}
      </div>
    </div>
  )
}

function Quality({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return <div className="flex items-center justify-between border-b border-zinc-100 py-3 text-sm last:border-b-0"><span className="flex items-center gap-2"><Icon className="h-4 w-4" />{label}</span><b>{value}</b></div>
}
