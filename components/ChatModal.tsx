
import { useEffect, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Sparkles, ExternalLink, Minimize2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ChatModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

interface Property {
  name: string
  area: string
  developer: string
  property_type: string
  bedrooms: number
  bathrooms: number
  min_price: number
  max_price: number
  area_sqft: number
  status: string
  sale_status: string
  amenities: string[]
}

export function ChatModal({ open, onOpenChange }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm **Shora**, your AI assistant at Roar Realty. 🏠✨\n\nHow can I help you find your perfect luxury property in Dubai today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const formatPrice = (price: number | null | undefined): string => {
    if (price === null || price === undefined || isNaN(price)) {
      return "N/A"
    }
    return price.toLocaleString()
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/chat?msg=${encodeURIComponent(userMessage.text)}`)
      const data = await res.json()

      if (data.success) {
        const aiMessage: Message = {
          id: Date.now().toString(),
          text: data.message,
          sender: "ai",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, aiMessage])

        if (data.intent === 'property_search' && data.properties && data.properties.length > 0) {
          const propertyCards = data.properties.slice(0, 3).map((property: Property, index: number) => {
            const minPrice = formatPrice(property.min_price)
            const maxPrice = formatPrice(property.max_price)
            const amenitiesText = property.amenities && property.amenities.length > 0 
              ? `\n🏊 **Amenities:** ${property.amenities.slice(0, 3).join(', ')}${property.amenities.length > 3 ? '...' : ''}`
              : ''

            return {
              id: `${Date.now()}-property-${index}`,
              text: `## 🏡 **${property.name || 'Luxury Property'}**

📍 **Location:** ${property.area || 'Dubai'}
🏗️ **Developer:** ${property.developer || 'Premium Developer'}
🏠 **Type:** ${property.property_type || 'Luxury Property'}
🛏️ **Bedrooms:** ${property.bedrooms || 'N/A'} | 🚿 **Bathrooms:** ${property.bathrooms || 'N/A'}
💰 **Price:** AED ${minPrice} - AED ${maxPrice}
📏 **Area:** ${property.area_sqft ? property.area_sqft.toLocaleString() + ' sqft' : 'N/A'}
✅ **Status:** ${property.status || 'Available'} | 🏷️ **Sale Status:** ${property.sale_status || 'Available'}${amenitiesText}`,
              sender: "ai" as const,
              timestamp: new Date(),
            }
          })

          setMessages((prev) => [...prev, ...propertyCards])
        }
      } else {
        throw new Error(data.message || 'Failed to get response')
      }
    } catch (err) {
      console.error("Error fetching AI response:", err)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          text: "⚠️ Sorry, I'm experiencing some technical difficulties. Please try again in a moment!",
          sender: "ai",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions = [
    "Show me luxury apartments",
    "Properties under 2M AED",
    "Downtown Dubai properties",
    "New project launches",
    "Contact"
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-lg transition-all duration-300 ease-in-out ${
        isMinimized ? 'h-[80px]' : 'h-[650px]'
      } flex flex-col p-0 overflow-hidden bg-gradient-to-br from-white to-gray-50 border-0 shadow-2xl`}>
        
        {/* Enhanced Header */}
        <DialogHeader className="p-4 pb-3 border-b border-gray-200 bg-gradient-to-r from-luxury/5 to-luxury-light/5">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-luxury via-luxury-light to-purple-500 flex items-center justify-center shadow-lg animate-pulse">
                  <img src={`/IMG_20250919_202345_090.webp`} className="h-full rounded-full w-full text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white animate-bounce"></div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold bg-gradient-to-r from-luxury to-luxury-light bg-clip-text text-transparent">
                    Shora AI
                  </span>
                  <span className="text-xs bg-luxury/10 text-luxury px-2 py-1 rounded-full font-medium">
                    BETA
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-normal">
                  Your Smart Property Assistant 🚀
                </p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        {!isMinimized && (
          <>
            {/* Quick Questions */}
            {messages.length === 1 && (
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-xs font-medium text-muted-foreground mb-2">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setInputValue(question)
                        handleSendMessage()
                      }}
                      className="text-xs h-7 px-3 bg-luxury/5 hover:bg-luxury/10 hover:border-luxury transition-all duration-200"
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages Area */}
            <ScrollArea className="flex-1 px-4 py-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} group`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[85%] ${
                        message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center shadow-lg shrink-0 ${
                          message.sender === "user"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                            : "bg-gradient-to-r from-luxury to-luxury-light text-white"
                        }`}
                      >
                        {message.sender === "user" ? (
                          <User className="h-4 w-4" />
                        ) : (
                        <img src={`/IMG_20250919_202345_090.webp`} className="h-full rounded-full w-full text-white" />
                        )}
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <div
                          className={`px-4 py-3 rounded-2xl text-sm shadow-sm transition-all duration-200 hover:shadow-md ${
                            message.sender === "user"
                              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                              : "bg-white text-foreground border border-gray-200 rounded-bl-md"
                          }`}
                        >
                          <div className="prose prose-sm max-w-none prose-headings:text-luxury prose-headings:font-bold prose-p:mb-2 prose-p:leading-relaxed">
                            <ReactMarkdown>{message.text}</ReactMarkdown>
                          </div>
                        </div>
                        
                        <span className={`text-xs text-muted-foreground px-2 ${
                          message.sender === "user" ? "text-right" : "text-left"
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start group">
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-luxury to-luxury-light flex items-center justify-center shadow-lg shrink-0">
                        <Sparkles className="h-4 w-4 text-white animate-pulse" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-gray-200 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-luxury rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-luxury rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-2 h-2 bg-luxury rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Enhanced Input Area */}
            <div className="p-4 pt-3 border-t border-gray-200 bg-white/50 backdrop-blur-sm">
              <div className="flex space-x-3 items-end">
                <div className="flex-1 relative">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask me anything about Dubai properties..."
                    className="resize-none border-gray-300 focus:ring-2 focus:ring-luxury focus:border-luxury rounded-xl bg-white/80 backdrop-blur-sm shadow-sm"
                    disabled={isTyping}
                  />
                  {inputValue && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                      {inputValue.length}/500
                    </div>
                  )}
                </div>
                <Button
                  onClick={handleSendMessage}
                  size="icon"
                  disabled={isTyping || !inputValue.trim()}
                  className="bg-gradient-to-r from-luxury to-luxury-light text-white hover:from-luxury-dark hover:to-luxury shadow-lg h-10 w-10 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Service Attribution */}
              <div className="mt-3 text-center">
                <a 
                  href="https://the-gangsta.tech" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-luxury transition-colors group"
                >
                  <span>Powered by</span>
                  <span className="font-medium group-hover:underline">The Gangsta.Tech</span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </a>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}