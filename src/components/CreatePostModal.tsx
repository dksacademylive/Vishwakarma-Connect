import React, { useState } from 'react';
import { Post, Language, PostFormConfig } from '../types';
import { DEFAULT_POST_CONFIG } from '../data/formsData';
import { X, Image as ImageIcon, Send, Settings } from 'lucide-react';

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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      author: author.trim(),
      city: city.trim() || 'भारत',
      roleOrGotra: roleOrGotra.trim() || 'समाज बंधु',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      category,
      content: content.trim(),
      image: imageUrl.trim() || undefined,
      likes: 0,
      isLiked: false,
      shares: 0,
      createdAt: 'अभी-अभी',
      comments: [],
    };

    onAddPost(newPost);
    onClose();
    // reset form
    setContent('');
    setImageUrl('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-stone-200">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-stone-900">
              {activeConfig.formTitle || (isHi ? 'समाज मंच पर नया विचार या शिल्प साझा करें' : 'Create Community Post')}
            </h3>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAdmin();
                }}
                className="px-2 py-0.5 text-[10px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 rounded border border-amber-300 flex items-center gap-1 cursor-pointer"
                title="एडमिन पोर्टल में पोस्ट फॉर्म सेटिंग्स संपादित करें"
              >
                <Settings className="w-3 h-3 text-amber-800" />
                <span>⚙️ एडमिन</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 cursor-pointer"
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
                placeholder="उदा. कैलाश जांगिड़"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                {isHi ? 'शहर / जिला *' : 'City *'}
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="उदा. जयपुर, राजस्थान"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                {isHi ? 'शाखा / गोत्र / पद' : 'Subcaste / Gotra'}
              </label>
              <input
                type="text"
                value={roleOrGotra}
                onChange={(e) => setRoleOrGotra(e.target.value)}
                placeholder="उदा. जांगिड़ · गोत्र: वशिष्ठ"
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                {isHi ? 'श्रेणी' : 'Category'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Post['category'])}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs bg-white"
              >
                <option value="general">सामान्य विचार (General)</option>
                <option value="shilp">शिल्प व व्यवसाय (Craft & Business)</option>
                <option value="utsav">उत्सव व जयंती (Festival)</option>
                <option value="youth">युवा व शिक्षा (Youth & Tech)</option>
                <option value="social">सामाजिक सूचना (Social Notice)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              {isHi ? 'संदेश / पोस्ट सामग्री *' : 'Post Content *'}
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                isHi
                  ? 'समाज बंधुओं के साथ अपने विचार, नई शिल्प कला, शुभकामना संदेश या सूचना साझा करें...'
                  : 'Write your message to the community...'
              }
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs font-hindi"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              {isHi ? 'फोटो वेब लिंक (वैकल्पिक)' : 'Photo URL (Optional)'}
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-xs"
            />
          </div>

          <div className="flex gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg cursor-pointer"
            >
              {isHi ? 'रद्द करें' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 py-2 text-xs font-semibold text-white bg-amber-800 hover:bg-amber-900 rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
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
