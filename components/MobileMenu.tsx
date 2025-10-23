import { useState, useEffect } from "react";
import { X, User, Plus, Minus, Globe, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItem {
  label: string;
  href: string;
}

interface SubSection {
  title: string;
  items: MenuItem[];
}

interface MenuSection {
  label: string;
  items?: MenuItem[];
  subsections?: SubSection[];
}

interface Currency {
  code: string;
  name: string;
  flag: string;
}

interface UserData {
  name: string;
  email: string;
  avatar?: string;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>({
    code: "AED",
    name: "UAE Dirham",
    flag: "🇦🇪",
  });

  const fetchUserData = async (token: string) => {
    setIsLoadingUser(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsLogin(true);
      } else {
        // Token invalid hai, remove karo
        Cookies.remove("token");
        setIsLogin(false);
        setUserData(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setIsLogin(false);
      setUserData(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  useEffect(() => {
    // Check for token in URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");

    if (tokenFromUrl) {
      // Save token to cookie
      Cookies.set("token", tokenFromUrl, { expires: 30 });

      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);

      // Fetch user data
      fetchUserData(tokenFromUrl);
    } else {
      // Check if token exists in cookies
      const token = Cookies.get("token");
      if (token) {
        fetchUserData(token);
      } else {
        setIsLogin(false);
        setUserData(null);
      }
    }
  }, []);

  const currencies: Currency[] = [
    { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
    { code: "INR", name: "India", flag: "🇮🇳" },
    { code: "GBP", name: "United Kingdom", flag: "🇬🇧" },
    { code: "SAR", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "CNY", name: "China", flag: "🇨🇳" },
    { code: "RUB", name: "Russia", flag: "🇷🇺" },
  ];

  useEffect(() => {
    const savedCurrency = Cookies.get("selectedCurrency");
    if (savedCurrency) {
      const currency = JSON.parse(savedCurrency);
      setSelectedCurrency(currency);
    }
  }, []);

  const handleCurrencyChange = (currency: Currency) => {
    setSelectedCurrency(currency);
    Cookies.set("selectedCurrency", JSON.stringify(currency), { expires: 10 });
    setShowCurrencyDropdown(false);
  };

  const handleLogout = () => {
    Cookies.remove("token");
    setIsLogin(false);
    setUserData(null);
    window.location.href = "/";
  };

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const menuSections: MenuSection[] = [
    {
      label: "Developers",
      items: [
        { label: "DAMAC", href: "/properties?developer=DAMAC" },
        { label: "Emaar", href: "/properties?developer=Emaar" },
        { label: "Meraas", href: "/properties?developer=Meraas" },
        { label: "Binghatti", href: "/properties?developer=Binghatti" },
        { label: "Nakheel", href: "/properties?developer=Nakheel" },
        { label: "Sobha", href: "/properties?developer=Sobha" },
        { label: "Taraf Holding", href: "/properties?developer=Taraf+holding" },
        { label: "Danube", href: "/properties?developer=Danube" },
        { label: "Ellington", href: "/properties?developer=Ellington" },
      ],
    },
    {
      label: "Status",
      items: [
        {
          label: "Under construction",
          href: "/properties?status=Under+construction",
        },
        { label: "Completed", href: "/properties?status=Completed" },
        { label: "Presale", href: "/properties?status=Presale" },
      ],
    },
    {
      label: "Sale Status",
      items: [
        {
          label: "Out of Stock",
          href: "/properties?sale_status=Out+of+stock",
        },
        {
          label: "On Sale",
          href: "/properties?sale_status=On+sale",
        },
        { label: "Presale(EOI)", href: "/properties?sale_status=Presale(EOI)" },
      ],
    },
    {
      label: "Location",
      items: [{ label: "Dubai", href: "/properties?location=Dubai" }],
    },
    {
      label: "About",
      items: [
        { label: "Our Story", href: "/story" },
        { label: "Our Team", href: "/team" },
        { label: "Contact Us", href: "/contact" },
        { label: "Careers", href: "/careers" },
      ],
    },
  ];

  const simpleLinks = [
    { label: "Blogs", href: "/blog" },
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-gradient-to-b from-white to-gray-50 z-50 shadow-2xl transition-transform duration-300 transform translate-x-0 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white shadow-sm">
          <h2 className="text-xl font-bold text-primary bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Menu
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6 text-gray-600" />
          </Button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto smooth-scroll">
          {/* Currency Selector */}
          <div className="border-b border-gray-200 px-5 py-4 bg-white">
            <div className="relative">
              <button
                onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                className="w-full flex items-center justify-between px-4 py-3.5 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 rounded-xl transition-all duration-200 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white rounded-lg shadow-sm">
                    <Globe className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-xl">{selectedCurrency.flag}</span>
                  <div className="text-left">
                    <span className="font-semibold text-gray-800 block text-sm">
                      {selectedCurrency.code}
                    </span>
                    <span className="text-xs text-gray-500">
                      {selectedCurrency.name}
                    </span>
                  </div>
                </div>
                <svg
                  className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                    showCurrencyDropdown ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Currency Dropdown */}
              {showCurrencyDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-10 max-h-64 overflow-y-auto">
                  {currencies.map((currency) => (
                    <button
                      key={currency.code}
                      onClick={() => handleCurrencyChange(currency)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 hover:bg-orange-50 transition-colors border-b border-gray-100 last:border-0 ${
                        selectedCurrency.code === currency.code
                          ? "bg-orange-50"
                          : ""
                      }`}
                    >
                      <span className="text-xl">{currency.flag}</span>
                      <div className="text-left">
                        <span className="font-semibold text-gray-800 block text-sm">
                          {currency.code}
                        </span>
                        <span className="text-xs text-gray-500">
                          {currency.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* User Profile / Sign In */}
          {isLogin && userData ? (
            <div className="border-b border-gray-200 bg-gradient-to-br from-orange-50 via-orange-100/30 to-white">
              {/* User Profile Card */}
              <div className="px-6 py-6">
                <div className="bg-white rounded-2xl shadow-lg border border-orange-100 p-5 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center space-x-4 mb-4">
                    {/* Avatar with Status Badge */}
                    <div className="relative flex-shrink-0">
                      {userData.profile ? (
                        <img
                          src={userData.profile}
                          alt={userData.name}
                          className="h-16 w-16 rounded-full object-cover border-3 border-orange-300 shadow-md ring-2 ring-orange-100"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg ring-2 ring-orange-100">
                          <span className="text-white text-2xl font-bold">
                            {userData.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      {/* Online Status Indicator */}
                      <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                        {userData.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate flex items-center">
                        <svg className="h-4 w-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {userData.email}
                      </p>
                    </div>
                  </div>

                  {/* Profile Action Buttons */}
                  {userData.role === "admin" && (
                    <a
                      href={`https://admin.roarrealty.ae/?token=${Cookies.get("token")}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Admin Panel</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-red-50 transition-colors group border-t border-gray-100"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-red-50 rounded-xl group-hover:bg-red-100 transition-colors shadow-sm">
                    <LogOut className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-800 block">Logout</span>
                    <span className="text-xs text-gray-500">Sign out from your account</span>
                  </div>
                </div>
                <svg
                  className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          ) : isLoadingUser ? (
            <div className="border-b border-gray-200 bg-gradient-to-br from-orange-50 to-white px-6 py-12">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="h-12 w-12 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 h-12 w-12 border-4 border-transparent border-b-orange-400 rounded-full animate-spin animation-delay-150"></div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">Loading your profile</p>
                  <p className="text-xs text-gray-500 mt-1">Please wait...</p>
                </div>
              </div>
            </div>
          ) : (
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/user/auth/google`}
              className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-orange-50 transition-all duration-200 border-b border-gray-200 bg-white group"
            >
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl group-hover:from-orange-100 group-hover:to-orange-200 transition-colors shadow-sm">
                  <User className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <span className="font-bold text-gray-900 block">Sign in / Register</span>
                  <span className="text-xs text-gray-500">Access your account</span>
                </div>
              </div>
              <svg
                className="h-6 w-6 text-gray-400 group-hover:text-orange-600 transition-colors group-hover:translate-x-1 duration-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          )}

          {/* Expandable Sections */}
          {menuSections.map((section, idx) => (
            <div
              key={section.label}
              className={`border-b border-gray-200 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <button
                onClick={() => toggleSection(section.label)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-orange-50 transition-colors group"
              >
                <span className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                  {section.label}
                </span>
                <div className="p-1.5 rounded-full group-hover:bg-orange-100 transition-colors">
                  {expandedSections.includes(section.label) ? (
                    <Minus className="h-4 w-4 text-gray-500 group-hover:text-orange-600" />
                  ) : (
                    <Plus className="h-4 w-4 text-gray-500 group-hover:text-orange-600" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expandedSections.includes(section.label)
                    ? "max-h-[600px] opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                {section.items && (
                  <div className="px-6 py-2 bg-gradient-to-b from-orange-50/30 to-transparent">
                    {section.items.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block py-2.5 pl-4 text-sm text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200 border-l-2 border-transparent hover:border-orange-600"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}

                {section.subsections?.map((subsection) => (
                  <div
                    key={subsection.title}
                    className="px-6 py-2 bg-gradient-to-b from-orange-50/30 to-transparent"
                  >
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 mt-2 pl-4">
                      {subsection.title}
                    </h4>
                    {subsection.items.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        className="block py-2 pl-4 text-sm text-gray-700 hover:text-orange-600 hover:translate-x-1 transition-all duration-200 border-l-2 border-transparent hover:border-orange-600"
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Simple Links */}
          {simpleLinks.map((link, idx) => (
            <a
              key={link.label}
              href={link.href}
              className={`block px-6 py-4 text-gray-800 font-semibold hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-gray-200 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}