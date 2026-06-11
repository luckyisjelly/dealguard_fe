import { Edit, MessageCircle } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { PageGrid } from '../../components/PageGrid'
import { SectionHeader } from '../../components/SectionHeader'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { api } from '../../lib/api'
import { formatPrice } from '../../lib/format'

export function ProductDetailPage() {
  const { productId } = useParams()
  const { data: product } = useQuery({ queryKey: ['product', productId], queryFn: () => api.product(Number(productId)) })
  if (!product) return null
  return (
    <PageGrid>
      <div className="space-y-5">
        <Card>
          <SectionHeader title="상품 게시글 정보">
            <Link to={`/products/${product.id}/edit`}><Button><Edit className="h-4 w-4" />수정</Button></Link>
          </SectionHeader>
          <div className="grid gap-y-6 border-t border-zinc-200 pt-6 md:grid-cols-4">
            <Info label="상품명" value={product.title} />
            <Info label="환불 정책" value={product.refundPolicyText ?? '미입력'} />
            <Info label="등록 가격" value={formatPrice(product.listedPrice)} />
            <Info label="거래 위치" value={product.tradeLocationText ?? '미입력'} />
            <Info label="카테고리" value={product.category} />
            <Info label="택배 가능" value={product.deliveryAvailable ? '가능' : '불가'} />
            <Info label="상품 상태" value={product.conditionDescription} />
          </div>
        </Card>
        <Card><SectionHeader title="상품 설명" /><p className="leading-7 text-zinc-700">{product.description}</p></Card>
        <Card><SectionHeader title="하자 설명" /><p className="leading-7 text-zinc-700">{product.defectDescription ?? '입력된 하자 설명이 없습니다.'}</p></Card>
      </div>
      <aside className="space-y-5">
        <Card>
          <SectionHeader title="다음 작업" />
          <Link to="/conversations"><Button className="w-full justify-start"><MessageCircle className="h-5 w-5" />거래 대화 생성</Button></Link>
        </Card>
        <Card className="text-sm leading-6 text-zinc-600">상품 게시글은 채팅 분석의 기준입니다. 채팅에서 다른 가격이나 환불 조건이 나오면 경고로 표시됩니다.</Card>
      </aside>
    </PageGrid>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return <div><p className="mb-2 text-sm font-bold">{label}</p><p className="text-zinc-700">{value}</p></div>
}
