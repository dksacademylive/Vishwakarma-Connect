import React from 'react';
import { AlertTriangle, ShieldCheck, X, Check, Mail, User, FileText } from 'lucide-react';
import { Language } from '../types';

interface AlreadyRegisteredModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  type: 'parinay' | 'membership';
  lang?: Language;
  details?: {
    name?: string;
    id?: string;
    date?: string;
  };
}

export const AlreadyRegisteredModal: React.FC<AlreadyRegisteredModalProps> = ({
  isOpen,
  onClose,
  email,
  type,
  lang = 'hi',
  details,
}) => {
  if (!isOpen) return null;

  const isHi = lang === 'hi';
  const isParinay = type === 'parinay';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border-2 border-amber-500/70 overflow-hidden my-auto transform transition-all">
        {/* Top Header Banner */}
        <div className={`p-5 text-white ${
          isParinay 
            ? 'bg-gradient-to-r from-rose-900 via-amber-900 to-rose-950'
            : 'bg-gradient-to-r from-amber-950 via-stone-900 to-amber-900'
        } relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title={isHi ? 'बंद करें' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-stone-950 uppercase tracking-wide">
                <span>{isHi ? '1 ईमेल = 1 पंजीकरण नीति' : 'Single Email Policy'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
                {isHi ? '⚠️ आप पहले से पंजीकृत हैं!' : '⚠️ Already Registered!'}
              </h3>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-4 font-hindi">
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <p className="text-xs sm:text-sm font-semibold text-stone-900 leading-relaxed">
              {isParinay
                ? isHi
                  ? 'इस ईमेल आईडी से परिणय मंच पर बायोडाटा पहले ही सफलतापूर्वक पंजीकृत किया जा चुका है।'
                  : 'A matrimonial biodata is already registered with this email address.'
                : isHi
                  ? 'इस ईमेल आईडी से समाज सदस्यता पहले ही सफलतापूर्वक पंजीकृत की जा चुकी है।'
                  : 'Community membership is already registered with this email address.'}
            </p>

            <div className="flex items-center gap-2 text-xs font-mono text-amber-950 bg-white/80 p-2 rounded-lg border border-amber-300">
              <Mail className="w-4 h-4 text-amber-700 shrink-0" />
              <span className="font-bold truncate">{email}</span>
            </div>
          </div>

          {/* Details Card if available */}
          {details && (details.name || details.id) && (
            <div className="bg-stone-50 rounded-xl p-3 border border-stone-200 text-xs space-y-1.5 text-stone-700">
              <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                {isHi ? 'पूर्व पंजीकृत विवरण:' : 'Existing Registered Info:'}
              </div>
              {details.name && (
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span><strong>{isHi ? 'पंजीकृत नाम:' : 'Name:'}</strong> {details.name}</span>
                </div>
              )}
              {details.id && (
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span><strong>{isHi ? (isParinay ? 'प्रोफाइल ID:' : 'सदस्यता क्र.:') : 'ID:'}</strong> <code className="font-mono font-bold text-amber-900">{details.id}</code></span>
                </div>
              )}
            </div>
          )}

          {/* Rule Notice */}
          <div className="p-3 bg-stone-100 rounded-xl text-[11px] text-stone-600 space-y-1 leading-relaxed border border-stone-200">
            <div className="font-bold text-stone-800 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isHi ? 'अखिल भारतीय विश्वकर्मा समाज महासंघ नियमावली:' : 'Federation Rules:'}</span>
            </div>
            <p>
              {isHi
                ? 'डेटा की प्रामाणिकता, सुरक्षा व निष्पक्षता बनाए रखने के लिए एक ईमेल से 2 बार पंजीकरण की अनुमति नहीं है। आपका पिछला डेटा सिस्टम में सुरक्षित है।'
                : 'To maintain authenticity, duplicate registrations with the same email are prohibited. Your prior submission remains safely recorded.'}
            </p>
          </div>

          {/* Close Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{isHi ? 'ठीक है, समझ गया (बंद करें)' : 'Understood, Close'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
