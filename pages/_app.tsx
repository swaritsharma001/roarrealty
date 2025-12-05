import "../styles/globals.css"
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "@/components/ThemeProvider"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import Layout from "@/components/Layout"
import { DefaultSeo } from "next-seo"
import SEO from "../next-seo.config"
import Head from "next/head"

const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {

  // 🔥 Payment Suspension Mode
  if (process.env.NEXT_PUBLIC_PAYMENT_DUE === "true") {
    return (
      <>
        <Head>
          <title>Service Suspended – Payment Required</title>
          <meta
            name="description"
            content="Your website is temporarily offline due to pending payment. Please contact billing to restore service."
          />
          <meta name="robots" content="noindex, nofollow" />
          <link rel="icon" href="/fav.ico" />
        </Head>

        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 via-black to-red-950 overflow-hidden text-white">
          
          {/* Background bubbles */}
          <div className="absolute inset-0 opacity-40">
            {[...Array(25)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-red-400 rounded-full mix-blend-screen"
                style={{
                  width: `${Math.random() * 50 + 20}px`,
                  height: `${Math.random() * 50 + 20}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 8}s`
                }}
              ></div>
            ))}
          </div>

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-md"></div>

          {/* Content */}
          <div className="relative z-10 text-center max-w-2xl px-6">
            <div className="mb-10">
              <div
                className="text-8xl mb-6 animate-pulse drop-shadow-xl"
                style={{ animation: "gentle-bounce 2.5s ease-in-out infinite" }}
              >
                ⚠️
              </div>

              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-red-400 via-yellow-400 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Service Suspended
              </h1>

              <p className="text-red-300 text-xl mt-4 font-medium">
                Due to non-payment, your website is temporarily offline.
              </p>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
              <p className="text-lg text-gray-200 leading-relaxed">
                We haven’t received the required payment for your account.  
                Until the pending balance is cleared, access to this website remains disabled.
              </p>

              <ul className="mt-5 text-left text-gray-300 space-y-2 text-base">
                <li>• The website will remain offline until dues are cleared.</li>
                <li>• No technical support is available during suspension.</li>
                <li>• All your data is safe and will be restored after payment.</li>
              </ul>

              <div className="mt-8">
                <a
                  href="mailto:anurag@rorerrealty.ae?subject=Payment%20Update"
                  className="inline-block bg-red-600 hover:bg-red-700 active:scale-95 px-6 py-3 rounded-lg font-semibold shadow-lg transition-all"
                >
                  Contact Billing
                </a>
              </div>
            </div>

            <p className="text-gray-400 text-sm mt-6">
              Billing Email: <span className="text-gray-200 font-medium">anurag@rorerrealty.ae</span>
            </p>
          </div>

          {/* Animations */}
          <style jsx global>{`
            @keyframes float {
              0%, 100% { transform: translateY(0px); opacity: 0.5; }
              50% { transform: translateY(-20px); opacity: 1; }
            }

            @keyframes gentle-bounce {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
          `}</style>
        </div>
      </>
    )
  }

  // 🌍 Normal Website Mode
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <TooltipProvider>
          <Head>
            <link rel="icon" href="/fav.ico" />
          </Head>

          <DefaultSeo {...SEO} />

          <Layout pageData={pageProps.initialPageData}>
            <Component {...pageProps} />
          </Layout>

          <Toaster />
          <Sonner />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default MyApp
