
import { ReactNode } from 'react'
import { Header } from './Header.tsx'
import { Footer } from './Footer.tsx'

interface LayoutProps {
  children: ReactNode
  pageData?: any
}

const Layout = ({ children, pageData }: LayoutProps) => {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer pageData={pageData} />
    </>
  )
}

export default Layout
