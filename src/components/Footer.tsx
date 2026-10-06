import React from 'react';
import { NavTab, Language, OrgContactInfo } from '../types';
import { Heart, ShieldCheck, Lock } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: NavTab) => void;
  lang: Language;
  orgContact?: OrgContactInfo;
  onOpenAdmin?: () => void;
  isAdminLoggedIn?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  setActiveTab,
  lang,
  orgContact,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const isHi = lang === 'hi';
  const contact = orgContact || {
    address: 'केंद्रीय विश्वकर्मा भवन, नई दिल्ली - 110001',
    helpline: '1800 233 4599 (टोल-फ्री)',
    email: 'sampark@vishwakarmasamaj.org',
    emergencyPhone: '+91 98290 99881',
    regNumber: 'DL/SOC/2018/8842',
    bankUpi: 'vishwakarmatrust@sbi',
  };

  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Devotion */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-xl font-bold text-amber-200 font-display block">
              {isHi ? 'विश्वकर्मा समाज कनेक्ट' : 'Vishwakarma Samaj Connect'}
            </span>
            <p className="text-xs text-stone-400 font-hindi leading-relaxed max-w-sm">
              {isHi
                ? 'अखिल भारतीय विश्वकर्मा समुदाय का आधिकारिक डिजिटल संगम। काष्ठ, लौह, स्वर्ण, पाषाण शिल्प, वैदिक स्थापत्य और आधुनिक तकनीकी नवाचार को समर्पित।'
                : 'The official digital collective honoring the ancient crafting, architectural, and modern engineering lineages of Lord Vishwakarma.'}
            </p>
            <div className="text-xs text-amber-400/90 font-hindi">
              {isHi
                ? '"ॐ श्री विश्वकर्मणे नमः · शिल्पं सर्वकर्मसु कुशलम्"'
                : '"Om Shri Vishwakarmaye Namah · Mastery in All Crafts"'}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              {isHi ? 'मुख्य अनुभाग' : 'Sections'}
            </div>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActiveTab('home')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isHi ? 'मुख्य पृष्ठ' : 'Home'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('feed')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isHi ? 'समाज चर्चा व विचार' : 'Community Feed'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('events')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isHi ? 'समाज आयोजन व महोत्सव' : 'Events & Conventions'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('directory')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isHi ? 'कारीगर व व्यापार निर्देशिका' : 'Artisans Directory'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('matrimony')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isHi ? 'विश्वकर्मा परिणय मंच' : 'Matrimonial Portal'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('heritage')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isHi ? 'पंचपुत्र परंपरा व मंदिर' : 'Heritage & Temples'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('luminaries')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isHi ? 'अमर शिल्पी व विभूतियां' : 'Luminaries & Hall of Fame'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('youth')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isHi ? 'युवा रोजगार व छात्रवृत्ति' : 'Youth & Scholarships'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('idcard')}
                  className="hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {isHi ? 'डिजिटल पहचान पत्र' : 'Samaj ID Card'}
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-white uppercase tracking-wider">
              {isHi ? 'समाज सचिवालय' : 'Central Secretariat'}
            </div>
            <div className="text-xs text-stone-400 space-y-1 font-hindi">
              <div>{contact.address}</div>
              <div>{isHi ? 'हेल्पलाइन:' : 'Helpline:'} {contact.helpline}</div>
              <div>{isHi ? 'ईमेल:' : 'Email:'} {contact.email}</div>
              <div className="pt-2 text-[11px] text-amber-300/80">
                {isHi ? 'रक्तदान आपातकाल:' : 'Blood Donation Emergency:'} {contact.emergencyPhone}
              </div>

              {onOpenAdmin && (
                <div className="pt-3">
                  <button
                    onClick={onOpenAdmin}
                    className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                    title={isHi ? 'केंद्रीय व्यवस्थापक / एडमिन पोर्टल (पासकोड: 1234)' : 'Admin Portal (Passcode: 1234)'}
                  >
                    <ShieldCheck className="w-4 h-4 text-stone-950" />
                    <span>{isHi ? '👑 एडमिन लॉगिन (पासकोड: 1234)' : '👑 Admin Login (PIN: 1234)'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <div>
            {isHi
              ? '© 2026 विश्वकर्मा समाज महासंघ (VishwaConnect). सर्वाधिकार सुरक्षित।'
              : '© 2026 Vishwakarma Samaj Federation (VishwaConnect). All rights reserved.'}
          </div>
          <div className="flex items-center gap-3 text-stone-400">
            <span>
              {isHi
                ? 'समाज सेवा एवं संस्कृति संरक्षण हेतु समर्पित'
                : 'Dedicated to community service and cultural heritage'}
            </span>
            {onOpenAdmin && !isAdminLoggedIn && (
              <button
                onClick={onOpenAdmin}
                className="text-amber-400/90 hover:text-amber-300 underline font-semibold cursor-pointer text-[11px]"
              >
                {isHi ? 'व्यवस्थापक पोर्टल (1234)' : 'Admin Portal (1234)'}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
