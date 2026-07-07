import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, BookOpen, ChevronRight, Phone, Award, ShieldAlert, User, Smartphone, FileText, Video, ExternalLink, Clock } from 'lucide-react';

interface StartScreenProps {
  onRegister: (fullName: string, phone: string, examId: string) => Promise<{ success: boolean; error?: string }>;
  loading: boolean;
  onAdminClick?: () => void;
  settings?: {
    logoUrl?: string;
    themeColor?: string;
    slogan?: string;
    teacherPhone?: string;
    teacherEmail?: string;
  };
}

export default function StartScreen({ onRegister, loading, onAdminClick, settings = {} }: StartScreenProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showTeacherContact, setShowTeacherContact] = useState(false);
  const [materials, setMaterials] = useState<any[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [selectedExamId, setSelectedExamId] = useState('default-exam');
  const [isExamLocked, setIsExamLocked] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lockedExamId = params.get('examId');
    if (lockedExamId) {
      setSelectedExamId(lockedExamId);
      setIsExamLocked(true);
    }
  }, []);

  useEffect(() => {
    fetch('/api/materials')
      .then((res) => res.json())
      .then((data) => {
        if (data.materials) {
          setMaterials(data.materials);
        }
      })
      .catch((err) => console.error('Error fetching materials:', err));

    fetch('/api/exams')
      .then((res) => res.json())
      .then((data) => {
        if (data.exams) {
          setExams(data.exams);
          // Only overwrite if exam isn't locked by URL query
          const params = new URLSearchParams(window.location.search);
          const lockedExamId = params.get('examId');
          if (lockedExamId) {
            setSelectedExamId(lockedExamId);
            setIsExamLocked(true);
          } else if (data.exams.length > 0) {
            setSelectedExamId(data.exams[0].id);
          }
        }
      })
      .catch((err) => console.error('Error fetching exams:', err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Vui lòng nhập Họ và tên của bạn.');
      return;
    }
    if (!phone.trim()) {
      setError('Vui lòng nhập Số điện thoại.');
      return;
    }
    
    // Simple phone regex check
    const phoneRegex = /^[0-9]{8,11}$/;
    if (!phoneRegex.test(phone.trim().replace(/[\s\.-]/g, ''))) {
      setError('Số điện thoại không hợp lệ. Vui lòng nhập từ 8 đến 11 chữ số.');
      return;
    }

    const res = await onRegister(fullName, phone, selectedExamId);
    if (!res.success && res.error) {
      setError(res.error);
    }
  };

  return (
    <div id="start-screen-container" className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Banner Accent */}
      <div className="h-2 bg-indigo-900 w-full" />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-12 flex-grow flex flex-col justify-center items-center">
        {!showRegisterForm ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
            id="welcome-card"
          >
            {/* Logo Section */}
            <div className="flex justify-center mb-6">
              {settings.logoUrl ? (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  referrerPolicy="no-referrer"
                  className="h-20 w-auto object-contain max-w-[240px] drop-shadow-md rounded-lg"
                />
              ) : (
                <div className="bg-indigo-900 text-white p-4 rounded-full shadow-lg flex items-center justify-center">
                  <Award className="w-12 h-12" />
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-indigo-950 mb-3 uppercase">
              ENGLISH PLACEMENT TEST
            </h1>
            <p className="text-xl text-slate-600 font-medium mb-8 font-sans max-w-xl mx-auto">
              {settings.slogan || 'Your English Journey Starts Here.'}
            </p>

            {/* Anti-fraud Red Warning */}
            <div
              id="anti-cheat-warning"
              className="bg-red-50 border-l-4 border-red-600 p-5 rounded-r-xl max-w-2xl mx-auto text-left mb-10 shadow-sm"
            >
              <div className="flex items-start">
                <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 mr-3 mt-0.5" />
                <div>
                  <h3 className="text-red-900 font-bold text-lg mb-1 uppercase tracking-wide">
                    Cảnh báo quan trọng cho thí sinh
                  </h3>
                  <p className="text-red-700 text-sm leading-relaxed">
                    Thí sinh <strong>không được sử dụng từ điển, AI, công cụ dịch thuật</strong> hoặc nhờ người khác hỗ trợ. 
                    Nếu không biết đáp án, hãy bỏ qua và tiếp tục làm bài. Hệ thống có cơ chế <strong>giám sát và khóa bài thi</strong> nếu phát hiện hành vi gian lận hoặc chuyển tab liên tục.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <button
                id="start-test-btn"
                onClick={() => setShowRegisterForm(true)}
                className="flex-1 bg-indigo-900 hover:bg-indigo-800 text-white font-semibold py-4 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center text-lg gap-2 cursor-pointer"
              >
                Start Test <ChevronRight className="w-5 h-5" />
              </button>
              
              <button
                id="contact-teacher-btn"
                onClick={() => setShowTeacherContact(!showTeacherContact)}
                className="flex-1 bg-white border-2 border-indigo-900 hover:bg-indigo-50 text-indigo-900 font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center text-lg gap-2 cursor-pointer"
              >
                <Phone className="w-5 h-5" /> Contact Teacher
              </button>
            </div>

            {/* Teacher Contact Info */}
            {showTeacherContact && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-6 p-5 bg-indigo-50 rounded-xl text-indigo-950 font-semibold shadow-inner max-w-md mx-auto border border-indigo-100 space-y-4"
                id="teacher-contact-info"
              >
                <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                  Kênh liên hệ hỗ trợ trực tiếp từ Giáo viên
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a
                    href={`tel:${settings.teacherPhone || '0987.654.321'}`}
                    className="flex items-center justify-center gap-1.5 p-3 bg-white border border-indigo-200 hover:bg-indigo-100/55 rounded-lg text-indigo-950 shadow-xs transition-all cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-indigo-900" /> Gọi Hotline
                  </a>
                  <a
                    href={`https://zalo.me/${(settings.teacherPhone || '0987.654.321').replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 p-3 bg-white border border-indigo-250 hover:bg-indigo-100/55 rounded-lg text-indigo-950 shadow-xs transition-all cursor-pointer font-bold"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 fill-indigo-900 shrink-0"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.22.22 2.39.63 3.48L1.05 21.1a1 1 0 0 0 1.25 1.25l5.62-1.58C9.01 21.18 10.47 21.5 12 21.5c5.52 0 10-4.48 10-10S17.52 2 12 2zm3.17 12.33c-.33-.17-.67-.33-1-.5-.17-.08-.33-.08-.5.08-.33.33-.67.67-1 .83-.17.08-.33.08-.5-.08a5.54 5.54 0 0 1-2.17-2.17c-.08-.17-.08-.33.08-.5.17-.33.5-.67.83-1 .17-.17.17-.33.08-.5-.17-.33-.33-.67-.5-1-.08-.17-.25-.17-.42-.17H11a1.27 1.27 0 0 0-1.08.67A4.27 4.27 0 0 0 9.5 12c0 2.22 1.78 4 4 4a4.27 4.27 0 0 0 2.33-.42 1.27 1.27 0 0 0 .67-1.08c0-.17 0-.33-.17-.5l-.16.33z"/></svg>
                    Zalo Chat
                  </a>
                  <a
                    href={`sms:${settings.teacherPhone || '0987.654.321'}`}
                    className="flex items-center justify-center gap-1.5 p-3 bg-white border border-indigo-200 hover:bg-indigo-100/55 rounded-lg text-indigo-950 shadow-xs transition-all cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 text-indigo-900" /> Nhắn tin SMS
                  </a>
                  <a
                    href={`mailto:${settings.teacherEmail || 'teacher@english.edu.vn'}`}
                    className="flex items-center justify-center gap-1.5 p-3 bg-white border border-indigo-200 hover:bg-indigo-100/55 rounded-lg text-indigo-950 shadow-xs transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-indigo-900" /> Gửi Email
                  </a>
                </div>
                
                <p className="text-xs font-normal text-slate-500 mt-2">
                  (Click chọn kênh liên hệ nếu bạn gặp sự cố kỹ thuật hoặc lỗi đường truyền audio)
                </p>
              </motion.div>
            )}

            {/* Study Materials Reference Section */}
            {materials.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-12 text-left max-w-2xl mx-auto border-t border-slate-200 pt-8"
              >
                <div className="flex items-center gap-2 mb-4">
                  <BookOpen className="w-5 h-5 text-indigo-900" />
                  <h3 className="text-lg font-extrabold text-indigo-950 uppercase tracking-wide">
                    TÀI LIỆU ÔN TẬP BỔ TRỢ
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Quý phụ huynh và học sinh có thể tham khảo các tài liệu học tập, luyện thi hoặc đề cương bám sát chương trình do Giáo viên đăng tải dưới đây để củng cố kiến thức trước khi làm bài thi chính thức.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {materials.map((m) => {
                    let IconComponent = BookOpen;
                    if (m.type === 'document') IconComponent = FileText;
                    else if (m.type === 'video') IconComponent = Video;
                    else if (m.type === 'link') IconComponent = ExternalLink;

                    return (
                      <a
                        key={m.id}
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex gap-3 p-4 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-200 rounded-xl shadow-xs transition-all duration-150 cursor-pointer"
                      >
                        <div className="flex-none p-2.5 bg-indigo-50 rounded-lg text-indigo-900 group-hover:bg-indigo-100/80 transition-colors h-11 w-11 flex items-center justify-center">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div className="space-y-0.5 overflow-hidden">
                          <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide line-clamp-1 group-hover:text-indigo-900 transition-colors">
                            {m.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-snug">
                            {m.description || 'Không có mô tả chi tiết.'}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </motion.div>
            )}

            <div className="mt-12 text-slate-400 text-xs font-mono">
              CAMBRIDGE ASSESSMENT & IELTS INSPIRED METHODOLOGY • DURATION: 45 MINUTES
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden"
            id="register-card"
          >
            {/* Form Header */}
            <div className="bg-indigo-950 text-white p-6 text-center relative">
              <button
                type="button"
                onClick={() => setShowRegisterForm(false)}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white text-sm"
              >
                Quay lại
              </button>
              <h2 className="text-xl font-bold">ĐĂNG KÝ THÔNG TIN</h2>
              <p className="text-xs text-indigo-200 mt-1">Thông tin này dùng để lưu trữ và hiển thị kết quả thi cho giáo viên</p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div id="register-error" className="bg-red-50 text-red-700 p-3 rounded-lg text-sm font-medium border border-red-100 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-900" /> Họ và tên thí sinh
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-900 focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Smartphone className="w-3.5 h-3.5 text-indigo-900" /> Số điện thoại
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  required
                  placeholder="Ví dụ: 0912345678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-900 focus:outline-none transition-colors"
                />
                <p className="text-slate-400 text-xs">
                  * Mỗi SĐT chỉ được làm bài 1 lần duy nhất. Nếu bạn đang làm dở, nhập đúng SĐT để tiếp tục làm tiếp.
                </p>
              </div>

              {exams.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-900" /> Chọn đề thi / Kỳ thi
                  </label>
                  {isExamLocked ? (
                    <div className="w-full px-4 py-3 bg-indigo-50 border-2 border-indigo-200 text-indigo-950 font-bold rounded-xl flex items-center gap-2 text-xs">
                      <span className="bg-indigo-900 text-white text-[10px] uppercase font-black px-1.5 py-0.5 rounded shrink-0">LINK KHÓA</span>
                      <span className="truncate">
                        {exams.find((e) => e.id === selectedExamId)?.title || selectedExamId} ({exams.find((e) => e.id === selectedExamId)?.durationMinutes || 45} phút)
                      </span>
                    </div>
                  ) : (
                    <select
                      id="reg-exam"
                      value={selectedExamId}
                      onChange={(e) => setSelectedExamId(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl bg-white focus:border-indigo-900 focus:outline-none transition-colors"
                    >
                      {exams.map((ex) => (
                        <option key={ex.id} value={ex.id}>
                          {ex.title} ({ex.durationMinutes} phút)
                        </option>
                      ))}
                    </select>
                  )}
                  {isExamLocked && (
                    <p className="text-[11px] text-indigo-800 italic leading-snug">
                      * Thí sinh đang truy cập thông qua liên kết trực tiếp. Bạn chỉ được phép thực hiện duy nhất bài thi này.
                    </p>
                  )}
                </div>
              )}

              {/* Warnings check boxes/notice */}
              <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-600 space-y-2 border border-slate-100">
                <div className="flex items-start gap-2">
                  <input type="checkbox" required id="agree-check" className="mt-0.5 accent-indigo-900" />
                  <label htmlFor="agree-check" className="cursor-pointer">
                    Tôi cam kết tự làm bài thi bằng năng lực thực tế, không sử dụng sự hỗ trợ của từ điển, AI hoặc người khác.
                  </label>
                </div>
              </div>

              <button
                id="submit-register-btn"
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-900 hover:bg-indigo-850 disabled:bg-indigo-300 text-white font-bold py-3.5 px-6 rounded-xl transition-all duration-150 flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                {loading ? 'Đang xác thực thông tin...' : 'Bắt đầu làm bài thi'} <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-indigo-950 text-slate-400 text-center py-6 text-sm border-t border-indigo-900">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>© 2026 Professional English Placement Test System. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#welcome-card" onClick={() => setShowTeacherContact(true)} className="hover:text-white transition-colors">Trợ giúp</a>
            <span className="text-indigo-800">|</span>
            <button
              onClick={onAdminClick}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Dành cho Giáo viên
            </button>
            <span className="text-indigo-800">|</span>
            <span className="font-mono text-xs">Version 1.0 (IELTS standard)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
