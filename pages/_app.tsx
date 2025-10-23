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
  if (process.env.NEXT_PUBLIC_MAINTENANCE === "true") {
    return (
      <>
        <Head>
          <title>Under Maintenance - We'll Be Right Back!</title>
          <meta name="description" content="We're currently updating our site to serve you better. Please check back soon!" />
          <link rel="icon" href="/fav.ico" />
          <meta name="robots" content="noindex, nofollow" />
        </Head>

        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-80 right-20 w-80 h-80 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{animationDelay: '3s'}}></div>
            <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '6s'}}></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-pulse" style={{animationDelay: '9s'}}></div>
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute bg-white rounded-full opacity-60"
                style={{
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 8}s`
                }}
              ></div>
            ))}
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>

          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
            <div className="mb-12 animate-fade-in">
              <div className="text-8xl md:text-9xl mb-8 filter drop-shadow-2xl" style={{animation: 'gentle-bounce 3s ease-in-out infinite'}}>
                ⚡
              </div>
              <h1 className="text-5xl md:text-8xl lg:text-9xl font-black bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6 animate-pulse leading-none tracking-tight">
                Under Maintenance
              </h1>
              <div className="h-2 w-48 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mx-auto rounded-full animate-pulse shadow-2xl"></div>
            </div>

            <div className="mb-12 animate-fade-in" style={{animationDelay: '0.8s'}}>
              <p className="text-slate-100 text-2xl md:text-3xl lg:text-4xl mb-6 leading-relaxed font-light tracking-wide">
                Upgrading to serve you better
              </p>
              <p className="text-cyan-300 text-xl md:text-2xl font-medium bg-white/5 backdrop-blur-sm rounded-full px-8 py-3 inline-block border border-white/10">
                🚀 Almost ready for takeoff
              </p>
            </div>

            <div className="mb-12 relative animate-fade-in" style={{animationDelay: '1.6s'}}>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-50 animate-pulse scale-110"></div>
              <div className="relative group">
                <img
                  src="/main.jpg"
                  alt="Under Maintenance"
                  className="mx-auto w-80 h-80 md:w-96 md:h-96 lg:w-[28rem] lg:h-[28rem] object-cover rounded-3xl shadow-2xl border-4 border-white/40 backdrop-blur-sm group-hover:scale-105 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 rounded-3xl"></div>
                <div className="absolute top-4 right-4 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                <div className="absolute top-4 right-4 w-4 h-4 bg-green-400 rounded-full"></div>
              </div>
            </div>

            <div className="mb-10 animate-fade-in" style={{animationDelay: '2.4s'}}>
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="mb-6">
                  <div className="flex justify-between text-slate-300 text-lg mb-4 font-medium">
                    <span>System Upgrade Progress</span>
                    <span className="text-cyan-400">73%</span>
                  </div>
                  <div className="w-full h-6 bg-slate-800/80 rounded-full overflow-hidden shadow-inner border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full shadow-lg transition-all duration-3000 ease-out relative overflow-hidden"
                      style={{width: '73%'}}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                    </div>
                  </div>
                </div>

                <p className="text-slate-200 text-xl mb-4">
                  ⭐ <span className="text-purple-300 font-semibold">Final optimizations in progress</span>
                </p>
                <p className="text-slate-400 text-base">
                  Expected completion: Very soon
                </p>
              </div>
            </div>

            <div className="space-y-6 animate-fade-in" style={{animationDelay: '3.2s'}}>
              <div className="flex items-center justify-center space-x-3 text-green-400 bg-green-500/10 backdrop-blur-sm rounded-full px-6 py-3 border border-green-500/20">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                <span className="text-lg font-medium">All Systems Active</span>
              </div>

              <div className="flex items-center justify-center space-x-8 text-slate-300">
                <div className="flex flex-col items-center space-y-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Database</span>
                  <span className="text-xs text-cyan-400">99%</span>
                </div>
                <div className="flex flex-col items-center space-y-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                  <span className="text-sm font-medium">Frontend</span>
                  <span className="text-xs text-purple-400">85%</span>
                </div>
                <div className="flex flex-col items-center space-y-2 bg-white/5 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
                  <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse" style={{animationDelay: '2s'}}></div>
                  <span className="text-sm font-medium">API</span>
                  <span className="text-xs text-pink-400">92%</span>
                </div>
              </div>
            </div>
          </div>

          <style jsx global>{`
            @keyframes float {
              0%, 100% { 
                transform: translateY(0px) rotate(0deg) scale(1); 
                opacity: 0.6;
              }
              33% { 
                transform: translateY(-20px) rotate(120deg) scale(1.1); 
                opacity: 0.9;
              }
              66% { 
                transform: translateY(-10px) rotate(240deg) scale(0.9); 
                opacity: 0.7;
              }
            }

            @keyframes gentle-bounce {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-10px) rotate(5deg); }
            }

            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(30px) scale(0.95);
              }
              to {
                opacity: 1;
                transform: translateY(0) scale(1);
              }
            }

            .animate-fade-in {
              animation: fade-in 1.2s ease-out forwards;
              opacity: 0;
            }

            @media (max-width: 768px) {
              .animate-fade-in {
                animation: fade-in 0.8s ease-out forwards;
              }
            }
          `}</style>
        </div>
      </>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
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
