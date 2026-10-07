import React from 'react';
import { NavTab, Language, OrgContactInfo } from '../types';
import { Heart, Globe } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
  lang: Language;
  orgContact?: OrgContactInfo;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, lang, orgContact }) => {
  const isHi = lang === 'hi';
  const contact = orgContact || {
    address: 'केंद्रीय विश्वकर्मा भवन, 12-B, शिल्पकार मार्ग, नई दिल्ली - 110001',
    helpline: '1800 233 4599 (टोल-फ्री)',
    email: 'sampark@vishwakarmasamaj.org',
    emergencyPhone: '+91 98290 99881',
    regNumber: 'DL/SOC/2018/8842',
    bankUpi: 'vishwakarmatrust@sbi',
    youtube: 'https://youtube.com/@vishwakarmasamaj',
    facebook: 'https://facebook.com/vishwakarmasamajconnect',
    whatsapp: 'https://wa.me/919829099881',
    instagram: 'https://instagram.com/vishwakarmasamaj',
    twitter: 'https://x.com/vishwakarmaorg',
    telegram: 'https://t.me/vishwakarmasamaj',
  };

  const socialLinks = [
    {
      name: 'WhatsApp',
      url: contact.whatsapp || 'https://wa.me/919829099881',
      color: 'hover:bg-emerald-600 hover:border-emerald-500 text-emerald-400 hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: contact.youtube || 'https://youtube.com/@vishwakarmasamaj',
      color: 'hover:bg-red-600 hover:border-red-500 text-red-400 hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: contact.facebook || 'https://facebook.com/vishwakarmasamajconnect',
      color: 'hover:bg-blue-600 hover:border-blue-500 text-blue-400 hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: contact.instagram || 'https://instagram.com/vishwakarmasamaj',
      color: 'hover:bg-pink-600 hover:border-pink-500 text-pink-400 hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      url: contact.twitter || 'https://x.com/vishwakarmaorg',
      color: 'hover:bg-stone-700 hover:border-stone-500 text-stone-300 hover:text-white',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'Telegram',
      url: contact.telegram || 'https://t.me/vishwakarmasamaj',
      color: 'hover:bg-sky-500 hover:border-sky-400 text-sky-400 hover:text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 mt-16 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand & Devotion */}
          <div className="sm:col-span-2 space-y-3">
            <span className="text-xl sm:text-2xl font-bold text-amber-200 font-display block">
              {isHi ? 'विश्वकर्मा समाज कनेक्ट' : 'Vishwakarma Samaj Connect'}
            </span>
            <p className="text-xs sm:text-sm text-stone-400 font-hindi leading-relaxed max-w-md">
              {isHi
                ? 'अखिल भारतीय विश्वकर्मा समुदाय का आधिकारिक डिजिटल संगम। काष्ठ, लौह, स्वर्ण, पाषाण शिल्प, वैदिक स्थापत्य और आधुनिक तकनीकी नवाचार को समर्पित।'
                : 'The official digital collective honoring the ancient crafting, architectural, and modern engineering lineages of Lord Vishwakarma.'}
            </p>
            <div className="text-xs text-amber-400/90 font-hindi">
              {isHi
                ? '"ॐ श्री विश्वकर्मणे नमः · शिल्पं सर्वकर्मसु कुशलम्"'
                : '"Om Shri Vishwakarmaye Namah · Mastery in All Crafts"'}
            </div>

            {/* Editable Social Media Community Links */}
            <div className="pt-2">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2 font-display">
                {isHi ? 'आधिकारिक सोशल मीडिया व संवाद मंच:' : 'Connect on Social Media:'}
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-8 h-8 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center transition-all shadow-2xs ${item.color}`}
                    title={item.name}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              {isHi ? 'मुख्य अनुभाग' : 'Sections'}
            </div>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {isHi ? 'मुख्य पृष्ठ' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {isHi ? 'समाज चर्चा व विचार' : 'Community Feed'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('events')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {isHi ? 'समाज आयोजन व महोत्सव' : 'Events & Conventions'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('directory')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {isHi ? 'कारीगर व व्यापार निर्देशिका' : 'Artisans Directory'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('matrimony')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {isHi ? 'विश्वकर्मा परिणय मंच' : 'Matrimonial Portal'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('heritage')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {isHi ? 'पंचपुत्र परंपरा व मंदिर' : 'Heritage & Temples'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('luminaries')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {isHi ? 'अमर शिल्पी व विभूतियां' : 'Luminaries & Hall of Fame'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('youth')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {isHi ? 'युवा रोजगार व छात्रवृत्ति' : 'Youth & Scholarships'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('idcard')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  {isHi ? 'डिजिटल पहचान पत्र' : 'Samaj ID Card'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              {isHi ? 'समाज सचिवालय' : 'Central Secretariat'}
            </div>
            <div className="text-xs text-stone-400 space-y-1.5 font-hindi leading-relaxed">
              <div>{contact.address}</div>
              <div>{isHi ? 'हेल्पलाइन:' : 'Helpline:'} <span className="font-mono text-stone-300">{contact.helpline}</span></div>
              <div>{isHi ? 'ईमेल:' : 'Email:'} <span className="text-stone-300">{contact.email}</span></div>
              <div className="pt-1 text-[11px] text-amber-300/90 font-medium">
                {isHi ? 'रक्तदान आपातकाल:' : 'Blood Emergency:'} <span className="font-mono text-amber-200">{contact.emergencyPhone}</span>
              </div>
              <div className="text-[11px] text-stone-500 font-mono">
                पंजीकरण: {contact.regNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar (Clean without admin button as requested) */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div className="text-center sm:text-left">
            {isHi
              ? '© 2026 विश्वकर्मा समाज महासंघ (VishwaConnect). सर्वाधिकार सुरक्षित।'
              : '© 2026 Vishwakarma Samaj Federation (VishwaConnect). All rights reserved.'}
          </div>
          <div className="flex items-center gap-2 text-stone-400 text-center sm:text-right">
            <span>
              {isHi
                ? 'समाज सेवा एवं संस्कृति संरक्षण हेतु समर्पित'
                : 'Dedicated to community service and cultural heritage'}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
