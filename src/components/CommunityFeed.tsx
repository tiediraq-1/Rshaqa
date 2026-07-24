import React, { useState } from 'react';
import {
  Users,
  Heart,
  MessageCircle,
  Plus,
  Share2,
  Sparkles,
  Flame,
  Clock,
  Send,
  UserCheck
} from 'lucide-react';
import { CommunityPost } from '../types';

interface CommunityFeedProps {
  posts: CommunityPost[];
  onToggleLike: (postId: string) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onCreatePost: (post: Omit<CommunityPost, 'id' | 'likesCount' | 'userLiked' | 'comments' | 'timestamp'>) => void;
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  posts = [],
  onToggleLike,
  onAddComment,
  onCreatePost,
}) => {
  const safePosts = posts || [];
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');

  // New Post Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [calories, setCalories] = useState<number>(320);
  const [prepTime, setPrepTime] = useState<number>(15);

  const handleCreatePostSubmit = () => {
    if (!title || !content) return;
    onCreatePost({
      authorName: 'عبدالله (أنت)',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      title,
      content,
      calories,
      prepTimeMinutes: prepTime,
    });
    setTitle('');
    setContent('');
    setIsNewPostModalOpen(false);
  };

  const handleSendComment = (postId: string) => {
    if (!commentInput.trim()) return;
    onAddComment(postId, commentInput.trim());
    setCommentInput('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 rounded-3xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full mb-2 inline-block">
            مجتمع رشاقة الداعم
          </span>
          <h2 className="text-2xl font-black">مجتمع تبادل الوصفات والتشجيع المتبادل</h2>
          <p className="text-emerald-100/80 text-xs mt-1">
            شارك أفكار وجباتك الصحية، تجاربك الناجحة، واستمد التحفيز من الأعضاء نحو هدفك
          </p>
        </div>

        <button
          onClick={() => setIsNewPostModalOpen(true)}
          className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>مشاركة وصفة أو تجربة جديدة</span>
        </button>
      </div>

      {/* Posts List */}
      <div className="max-w-3xl mx-auto space-y-6">
        {safePosts.map((post) => (
          <div key={post.id} className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            
            {/* Author Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.authorAvatar}
                  alt={post.authorName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-emerald-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-extrabold text-slate-900 text-sm">{post.authorName}</h4>
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">{post.timestamp}</div>
                </div>
              </div>

              {post.calories && (
                <div className="flex items-center gap-2 text-xs font-black bg-amber-50 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{post.calories} سعرة</span>
                </div>
              )}
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <h3 className="font-black text-slate-900 text-base leading-snug">{post.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{post.content}</p>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-bold text-slate-600">
              
              <button
                onClick={() => onToggleLike(post.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  post.userLiked
                    ? 'bg-rose-50 text-rose-600 font-extrabold'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{post.likesCount} تشجيع</span>
              </button>

              <button
                onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-slate-500" />
                <span>{post.comments.length} تعليقات</span>
              </button>

              <button className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-slate-100 rounded-xl transition-all cursor-pointer">
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>مشاركة</span>
              </button>

            </div>

            {/* Comments Drawer Section */}
            {activeCommentPostId === post.id && (
              <div className="pt-3 border-t border-slate-100 space-y-3 bg-slate-50 p-4 rounded-2xl">
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {post.comments.length === 0 ? (
                    <p className="text-xs text-slate-400">لا توجد تعليقات بعد، كن أول من يشجع صاحب الوصفة!</p>
                  ) : (
                    post.comments.map((c) => (
                      <div key={c.id} className="bg-white p-2.5 rounded-xl text-xs space-y-0.5 border border-slate-100">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{c.authorName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{c.timestamp}</span>
                        </div>
                        <p className="text-slate-600">{c.content}</p>
                      </div>
                    ))
                  )}
                </div>

                {/* Comment Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="اكتب كلمة تشجيع أو استفسار..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-emerald-500"
                  />
                  <button
                    onClick={() => handleSendComment(post.id)}
                    className="p-2 bg-emerald-600 text-white rounded-xl cursor-pointer hover:bg-emerald-700"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

              </div>
            )}

          </div>
        ))}
      </div>

      {/* New Post Modal */}
      {isNewPostModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-lg">نشر وصفة أو فكرة جديدة للمجتمع</h3>
              <button onClick={() => setIsNewPostModalOpen(false)} className="text-slate-400 font-bold p-1 cursor-pointer">✕</button>
            </div>

            <div className="space-y-3 text-xs font-bold text-slate-800">
              <div>
                <label className="block mb-1 text-slate-600">عنوان منشورك أو الوصفة:</label>
                <input
                  type="text"
                  placeholder="مثال: ساندويتش التونة الصحي عالي البروتين"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-600">شرح الوصفة والتفاصيل:</label>
                <textarea
                  rows={3}
                  placeholder="اكتب المكونات وطريقة التحضير باختصار لتشجيع زملائك..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1 text-slate-600">السعرات التقديرية:</label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-600">وقت التحضير (دقائق):</label>
                  <input
                    type="number"
                    value={prepTime}
                    onChange={(e) => setPrepTime(Number(e.target.value))}
                    className="w-full py-2 px-3 bg-slate-50 border rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => setIsNewPostModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl cursor-pointer">إلغاء</button>
              <button onClick={handleCreatePostSubmit} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer">نشر الآن</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
