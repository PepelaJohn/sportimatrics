import dynamic from 'next/dynamic'
 
const NoSSR = dynamic(() => import('./mypage'), { ssr: false })
 
export default function Page() {
  return (
    <>
      <NoSSR />
    </>
  )
}