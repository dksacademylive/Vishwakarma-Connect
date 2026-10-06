import React, { useState, useRef } from 'react';
import { Post, Language, PostFormConfig } from '../types';
import { DEFAULT_POST_CONFIG } from '../data/formsData';
import { X, Image as ImageIcon, Send, Settings, Upload, Trash2 } from 'lucide-react';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPost: (post: Post) => void;
  lang: Language;
  postConfig?: PostFormConfig;
  onOpenAdmin?: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onAddPost,
  lang,
  postConfig,
  onOpenAdmin,
}) => {
  const isHi = lang === 'hi';
  const activeConfig = postConfig || DEFAULT_POST_CONFIG;
  const [author, setAuthor] = useState('');
  const [city, setCity] = useState('');
  const [roleOrGotra, setRoleOrGotra] = useState('');
  const [category, setCategory] = useState<Post['category']>('general');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert(isHi ? 'कृपया 5MB से छोटी फाइल चुनें।' : 'Please choose an image under 5MB.');
        return;
      }
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setUploadedImagePreview(result);
        setImageUrl('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveUploadedImage = () => {
    setUploadedImagePreview(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;

    const finalImage = uploadedImagePreview || imageUrl.trim() || undefined;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: author.trim(),
      city: city.trim() || (isHi ? 'भारत' : 'India'),
      roleOrGotra: roleOrGotra.trim() || (isHi ? 'समाज बंधु' : 'Community Member'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      category,
      content: content.trim(),
      image: finalImage,
      likes: 0,
      isLiked: false,
      shares: 0,
      createdAt: isHi ? 'अभी-अभी' : 'Just now',
      comments: [],
    };

    onAddPost(newPost);
    onClose();
    // reset form
    setContent('');
    setImageUrl('');
    handleRemoveUploadedImage();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900 font-display">
              {isHi
                ? (activeConfig.formTitle || 'समाज मंच पर नया विचार या शिल्प साझा करें')
                : 'Create Community Discussion Post'}
            </h3>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="px-2 py-0.5 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded border border-amber-300 flex items-center gap-1 cursor-pointer"
                title={isHi ? 'एडमिन पोर्टल में पोस्ट फॉर्म सेटिंग्स संपादित करें' : 'Edit post settings in admin'}
              >
                <Settings className="w-3 h-3 text-amber-800" />
                <span>{isHi ? 'एडमिन' : 'Admin'}</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                {isHi ? 'आपका नाम *' : 'Your Name *'}
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={isHi ? 'उदा. राकेश जांगिड़' : 'e.g. Rakesh Jangid'}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-amber-700"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                {isHi ? 'नगर / शहर *' : 'City / State *'}
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={isHi ? 'उदा. जयपुर, राजस्थान' : 'e.g. Jaipur, Rajasthan'}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-amber-700"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                {isHi ? 'शाखा / गोत्र (वैकल्पिक)' : 'Subcaste / Gotra (Optional)'}
              </label>
              <input
                type="text"
                value={roleOrGotra}
                onChange={(e) => setRoleOrGotra(e.target.value)}
                placeholder={isHi ? 'उदा. जांगिड़ · गोत्र: वशिष्ठ' : 'e.g. Jangid · Gotra: Vashishtha'}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs focus:outline-none focus:border-amber-700"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                {isHi ? 'श्रेणी *' : 'Category *'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Post['category'])}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white focus:outline-none focus:border-amber-700"
              >
                <option value="general">{isHi ? 'सामान्य विचार' : 'General Update'}</option>
                <option value="shilp">{isHi ? 'शिल्प व व्यवसाय' : 'Craft & Business'}</option>
                <option value="utsav">{isHi ? 'उत्सव व जयंती' : 'Festival & Celebration'}</option>
                <option value="youth">{isHi ? 'युवा व शिक्षा' : 'Youth & Education'}</option>
                <option value="social">{isHi ? 'सामाजिक सूचना' : 'Community Notice'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              {isHi ? 'संदेश / पोस्ट सामग्री *' : 'Post Content *'}
            </label>
            <textarea
              rows={3}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isHi
                  ? 'समाज बंधुओं के साथ अपने विचार, नई शिल्प कला, शुभकामना संदेश या सूचना साझा करें...'
                  : 'Write your message, artisan craft showcase, celebration note, or announcement...'
              }
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-hindi focus:outline-none focus:border-amber-700"
            />
          </div>

          {/* Photo Upload: Direct Mobile / PC PNG/JPG Upload Option */}
          <div className="space-y-1.5 p-3 bg-stone-50 border border-stone-200 rounded-xl">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-amber-800" />
                <span>{isHi ? 'फोटो अपलोड (Mobile / PC से PNG या JPG)' : 'Upload Photo (PNG / JPG from Device)'}</span>
              </label>
              <span className="text-[10px] text-stone-500">
                {isHi ? 'अधिकतम 5MB' : 'Max 5MB'}
              </span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/png, image/jpeg, image/jpg, image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />

            {uploadedImagePreview ? (
              <div className="relative rounded-lg overflow-hidden border border-amber-300 bg-white p-2 flex items-center gap-3">
                <img
                  src={uploadedImagePreview}
                  alt="Upload preview"
                  className="w-14 h-14 rounded-md object-cover border border-stone-200"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <span>✓ {isHi ? 'फोटो अपलोड सफल' : 'Photo Attached'}</span>
                  </div>
                  <div className="text-[11px] text-stone-600 truncate">{fileName}</div>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveUploadedImage}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  title={isHi ? 'फोटो हटाएं' : 'Remove Photo'}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-2 px-3 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isHi ? 'मोबाइल / PC से फोटो चुनें (PNG/JPG)' : 'Upload PNG/JPG from Device'}</span>
                </button>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder={isHi ? 'या फोटो लिंक (URL)' : 'Or Image URL'}
                  className="flex-1 px-3 py-2 border border-stone-200 bg-white rounded-lg text-xs focus:outline-none focus:border-amber-700"
                />
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isHi ? 'पोस्ट प्रकाशित करें' : 'Publish Post'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
