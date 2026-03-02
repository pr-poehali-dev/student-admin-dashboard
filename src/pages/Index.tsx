import { useState } from 'react';
import Icon from '@/components/ui/icon';

// ─── TYPES ───────────────────────────────────────────────────────────────────

type Screen = 'landing' | 'student-login' | 'admin-login' | 'student-dashboard' | 'admin-dashboard';
type StudentTab = 'schedule' | 'absences' | 'rating' | 'profile';
type AdminTab = 'schedule' | 'absences' | 'rating' | 'management' | 'profile';

interface Absence {
  id: number;
  date: string;
  subject: string;
  lesson: number;
  reason: string;
  confirmed: boolean;
}

interface Notification {
  id: number;
  text: string;
  read: boolean;
  date: string;
}

interface Student {
  id: number;
  nickname: string;
  password: string;
  avatar: string;
  color: string;
  absences: Absence[];
  notifications: Notification[];
}

interface Admin {
  id: number;
  nickname: string;
  password: string;
  avatar: string;
}

interface ScheduleLesson {
  id: number;
  day: string;
  lesson: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const SCHEDULE: ScheduleLesson[] = [
  { id: 1, day: 'Понедельник', lesson: 1, time: '08:00–09:35', subject: 'Математика', teacher: 'Иванова Т.В.', room: '214' },
  { id: 2, day: 'Понедельник', lesson: 2, time: '09:45–11:20', subject: 'Физика', teacher: 'Петров А.И.', room: '115' },
  { id: 3, day: 'Понедельник', lesson: 3, time: '11:40–13:15', subject: 'Информатика', teacher: 'Смирнова К.О.', room: '301' },
  { id: 4, day: 'Вторник', lesson: 1, time: '08:00–09:35', subject: 'Химия', teacher: 'Козлов Д.С.', room: '205' },
  { id: 5, day: 'Вторник', lesson: 2, time: '09:45–11:20', subject: 'История', teacher: 'Новикова М.В.', room: '112' },
  { id: 6, day: 'Вторник', lesson: 3, time: '11:40–13:15', subject: 'Русский язык', teacher: 'Орлова Е.А.', room: '210' },
  { id: 7, day: 'Вторник', lesson: 4, time: '13:45–15:20', subject: 'Физкультура', teacher: 'Захаров П.Р.', room: 'Спортзал' },
  { id: 8, day: 'Среда', lesson: 1, time: '08:00–09:35', subject: 'Математика', teacher: 'Иванова Т.В.', room: '214' },
  { id: 9, day: 'Среда', lesson: 2, time: '09:45–11:20', subject: 'Информатика', teacher: 'Смирнова К.О.', room: '301' },
  { id: 10, day: 'Среда', lesson: 3, time: '11:40–13:15', subject: 'Биология', teacher: 'Фёдорова Л.П.', room: '118' },
  { id: 11, day: 'Четверг', lesson: 1, time: '08:00–09:35', subject: 'Физика', teacher: 'Петров А.И.', room: '115' },
  { id: 12, day: 'Четверг', lesson: 2, time: '09:45–11:20', subject: 'История', teacher: 'Новикова М.В.', room: '112' },
  { id: 13, day: 'Четверг', lesson: 3, time: '11:40–13:15', subject: 'Литература', teacher: 'Морозова Н.Д.', room: '211' },
  { id: 14, day: 'Пятница', lesson: 1, time: '08:00–09:35', subject: 'Химия', teacher: 'Козлов Д.С.', room: '205' },
  { id: 15, day: 'Пятница', lesson: 2, time: '09:45–11:20', subject: 'Математика', teacher: 'Иванова Т.В.', room: '214' },
  { id: 16, day: 'Пятница', lesson: 3, time: '11:40–13:15', subject: 'Русский язык', teacher: 'Орлова Е.А.', room: '210' },
];

const DAYS = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница'];
const AVATARS = ['🐱', '🦊', '🐺', '🦁', '🐻', '🐼', '🦋', '🐸', '🦅', '🐉', '🌟', '🎭', '🚀', '⚡', '🔥', '🌊'];
const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

const initStudents = (): Student[] => [
  {
    id: 1, nickname: 'Максим_К', password: '1234', avatar: '🚀', color: '#3b82f6',
    absences: [
      { id: 1, date: 'Понедельник', subject: 'Математика', lesson: 1, reason: 'Болезнь', confirmed: true },
      { id: 2, date: 'Среда', subject: 'Информатика', lesson: 2, reason: '', confirmed: false },
    ],
    notifications: [{ id: 1, text: 'Пропуск добавлен: Математика (Понедельник)', read: false, date: '02.03.2026' }]
  },
  {
    id: 2, nickname: 'Аня_С', password: '5678', avatar: '🦋', color: '#ec4899',
    absences: [], notifications: []
  },
  {
    id: 3, nickname: 'Дима_В', password: '9012', avatar: '⚡', color: '#f59e0b',
    absences: [
      { id: 3, date: 'Вторник', subject: 'Химия', lesson: 1, reason: 'Соревнования', confirmed: true },
      { id: 4, date: 'Вторник', subject: 'История', lesson: 2, reason: 'Соревнования', confirmed: true },
      { id: 5, date: 'Четверг', subject: 'Физика', lesson: 1, reason: '', confirmed: false },
    ],
    notifications: [
      { id: 2, text: 'Пропуск добавлен: Химия (Вторник)', read: true, date: '01.03.2026' },
      { id: 3, text: 'Пропуск добавлен: История (Вторник)', read: false, date: '01.03.2026' },
    ]
  },
  {
    id: 4, nickname: 'Катя_М', password: '3456', avatar: '🌊', color: '#06b6d4',
    absences: [
      { id: 6, date: 'Пятница', subject: 'Химия', lesson: 1, reason: 'Больничный', confirmed: true },
    ],
    notifications: []
  },
  {
    id: 5, nickname: 'Влад_П', password: '7890', avatar: '🐉', color: '#8b5cf6',
    absences: [
      { id: 7, date: 'Среда', subject: 'Биология', lesson: 3, reason: '', confirmed: false },
      { id: 8, date: 'Четверг', subject: 'История', lesson: 2, reason: '', confirmed: false },
      { id: 9, date: 'Четверг', subject: 'Литература', lesson: 3, reason: '', confirmed: false },
      { id: 10, date: 'Пятница', subject: 'Математика', lesson: 2, reason: '', confirmed: false },
    ],
    notifications: [{ id: 4, text: 'Пропуск добавлен: Биология (Среда)', read: false, date: '02.03.2026' }]
  },
];

const initAdmins = (): Admin[] => [
  { id: 1, nickname: 'Куратор_211', password: 'admin123', avatar: '🎓' },
  { id: 2, nickname: 'Зам_Директора', password: 'zam456', avatar: '🏫' },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function AvatarBadge({ emoji, color, size = 40 }: { emoji: string; color?: string; size?: number }) {
  return (
    <div
      className="rounded-2xl flex items-center justify-center flex-shrink-0 glass"
      style={{ width: size, height: size, fontSize: size * 0.5, background: color ? `${color}22` : 'rgba(255,255,255,0.06)', border: `1.5px solid ${color ? color + '44' : 'rgba(255,255,255,0.1)'}` }}
    >
      {emoji}
    </div>
  );
}

function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-notification-pop" style={{ fontSize: 10 }}>
      {count > 9 ? '9+' : count}
    </span>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────

function LandingScreen({ onRole }: { onRole: (r: 'student' | 'admin') => void }) {
  return (
    <div className="min-h-screen bg-animated flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full opacity-20 animate-spin-slow"
        style={{ background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #06b6d4, #3b82f6)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-[-80px] right-[-80px] w-[300px] h-[300px] rounded-full opacity-15 animate-float"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(40px)' }} />

      <div className="relative z-10 text-center max-w-sm w-full">
        <div className="opacity-0 animate-fade-in-up delay-100 mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs font-medium text-blue-400" style={{ animationFillMode: 'forwards' }}>
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse-glow" />
          Электронный журнал
        </div>

        <div className="opacity-0 animate-fade-in-up delay-200 mb-4 text-7xl animate-float" style={{ animationFillMode: 'forwards' }}>
          🎓
        </div>

        <h1 className="opacity-0 animate-fade-in-up delay-300 font-golos font-black text-4xl leading-tight mb-3" style={{ animationFillMode: 'forwards' }}>
          <span className="gradient-text-blue glow-text-blue">Добро</span>{' '}
          <span className="text-foreground">пожаловать</span>
        </h1>

        <p className="opacity-0 animate-fade-in-up delay-400 text-xl font-golos font-semibold text-muted-foreground mb-1" style={{ animationFillMode: 'forwards' }}>
          Дневник группы
        </p>
        <p className="opacity-0 animate-fade-in-up delay-500 text-3xl font-golos font-black gradient-text-purple glow-text-purple mb-10" style={{ animationFillMode: 'forwards' }}>
          211-Г
        </p>

        <div className="opacity-0 animate-fade-in-up delay-600 space-y-3" style={{ animationFillMode: 'forwards' }}>
          <button
            onClick={() => onRole('student')}
            className="w-full py-4 px-6 rounded-2xl font-golos font-bold text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95 glow-blue"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}
          >
            <span className="flex items-center justify-center gap-3">
              <span className="text-2xl">🎒</span>
              Студенту
            </span>
          </button>

          <button
            onClick={() => onRole('admin')}
            className="w-full py-4 px-6 rounded-2xl font-golos font-bold text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95 glow-purple"
            style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
          >
            <span className="flex items-center justify-center gap-3">
              <span className="text-2xl">🏫</span>
              Администратору
            </span>
          </button>
        </div>

        <p className="opacity-0 animate-fade-in-up delay-600 mt-8 text-xs text-muted-foreground" style={{ animationFillMode: 'forwards' }}>
          ГБПОУ · Группа 211-Г · 2025–2026
        </p>
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────

function LoginScreen({ role, students, admins, onStudentLogin, onAdminLogin, onBack }: {
  role: 'student' | 'admin';
  students: Student[];
  admins: Admin[];
  onStudentLogin: (s: Student) => void;
  onAdminLogin: (a: Admin) => void;
  onBack: () => void;
}) {
  const [nick, setNick] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isStudent = role === 'student';

  const handleLogin = () => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (isStudent) {
        const s = students.find(st => st.nickname === nick && st.password === pass);
        if (s) onStudentLogin(s);
        else setError('Неверный псевдоним или пароль');
      } else {
        const a = admins.find(ad => ad.nickname === nick && ad.password === pass);
        if (a) onAdminLogin(a);
        else setError('Неверный псевдоним или пароль');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-animated flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-60px] right-[-60px] w-[250px] h-[250px] rounded-full opacity-20"
        style={{ background: isStudent ? 'radial-gradient(circle, #3b82f6, transparent)' : 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(50px)' }} />

      <div className="relative z-10 w-full max-w-sm">
        <button onClick={onBack} className="opacity-0 animate-fade-in-up delay-100 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group" style={{ animationFillMode: 'forwards' }}>
          <Icon name="ChevronLeft" size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-golos font-medium">Назад</span>
        </button>

        <div className="opacity-0 animate-fade-in-up delay-200 glass rounded-3xl p-8" style={{ animationFillMode: 'forwards' }}>
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">{isStudent ? '🎒' : '🏫'}</div>
            <h2 className="font-golos font-black text-2xl text-foreground mb-1">
              {isStudent ? 'Вход для студентов' : 'Вход для администраторов'}
            </h2>
            <p className="text-muted-foreground text-sm font-golos">Группа 211-Г</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-golos font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Псевдоним</label>
              <input
                type="text"
                value={nick}
                onChange={e => setNick(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder={isStudent ? 'Максим_К' : 'Куратор_211'}
                className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground font-golos focus:outline-none input-glow transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-golos font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Пароль</label>
              <input
                type="password"
                value={pass}
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="••••••••"
                className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground font-golos focus:outline-none input-glow transition-all"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm font-golos bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 animate-fade-in-scale">
                <Icon name="AlertCircle" size={16} />
                {error}
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading || !nick || !pass}
              className="w-full py-4 rounded-2xl font-golos font-bold text-lg text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100"
              style={{ background: isStudent ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon name="Loader2" size={18} className="animate-spin" />
                  Входим...
                </span>
              ) : 'Войти'}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6 font-golos">
            Если забыли пароль — обратитесь к куратору
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── STUDENT DASHBOARD ────────────────────────────────────────────────────────

function StudentDashboard({ student, students, onLogout, onUpdateStudent }: {
  student: Student;
  students: Student[];
  onLogout: () => void;
  onUpdateStudent: (s: Student) => void;
}) {
  const [tab, setTab] = useState<StudentTab>('schedule');
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [profileAvatarPicker, setProfileAvatarPicker] = useState(false);
  const [newPass, setNewPass] = useState('');
  const [newPass2, setNewPass2] = useState('');
  const [passMsg, setPassMsg] = useState('');

  const unreadCount = student.notifications.filter(n => !n.read).length;
  const dayLessons = SCHEDULE.filter(l => l.day === selectedDay);
  const absenceOnLesson = (lesson: ScheduleLesson) =>
    student.absences.find(a => a.date === lesson.day && a.lesson === lesson.lesson);

  const subjectStats: Record<string, number> = {};
  student.absences.forEach(a => {
    subjectStats[a.subject] = (subjectStats[a.subject] || 0) + 1;
  });

  const ranking = [...students]
    .sort((a, b) => a.absences.length - b.absences.length)
    .map((s, i) => ({ ...s, rank: i + 1 }));
  const myRank = ranking.find(s => s.id === student.id);

  const handlePassChange = () => {
    if (!newPass) { setPassMsg('Введите новый пароль'); return; }
    if (newPass !== newPass2) { setPassMsg('Пароли не совпадают'); return; }
    if (newPass.length < 4) { setPassMsg('Минимум 4 символа'); return; }
    onUpdateStudent({ ...student, password: newPass });
    setNewPass(''); setNewPass2('');
    setPassMsg('✅ Пароль обновлён!');
    setTimeout(() => setPassMsg(''), 2500);
  };

  const markNotifRead = () => {
    onUpdateStudent({ ...student, notifications: student.notifications.map(n => ({ ...n, read: true })) });
  };

  const tabs: { key: StudentTab; icon: string; label: string }[] = [
    { key: 'schedule', icon: 'CalendarDays', label: 'Расписание' },
    { key: 'absences', icon: 'XCircle', label: 'Пропуски' },
    { key: 'rating', icon: 'Trophy', label: 'Рейтинг' },
    { key: 'profile', icon: 'User', label: 'Профиль' },
  ];

  return (
    <div className="min-h-screen bg-animated flex flex-col" style={{ paddingBottom: 84 }}>
      <div className="glass sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AvatarBadge emoji={student.avatar} color={student.color} size={38} />
          <div>
            <p className="font-golos font-bold text-sm text-foreground">{student.nickname}</p>
            <p className="font-golos text-xs text-muted-foreground">Группа 211-Г</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 glass rounded-xl" onClick={markNotifRead}>
            <Icon name="Bell" size={18} className="text-muted-foreground" />
            <NotificationBadge count={unreadCount} />
          </button>
          <button onClick={onLogout} className="p-2 glass rounded-xl hover:bg-red-500/10 transition-colors">
            <Icon name="LogOut" size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex-1 px-4 pt-4 pb-2">

        {/* SCHEDULE TAB */}
        {tab === 'schedule' && (
          <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h2 className="font-golos font-black text-2xl mb-1">Расписание</h2>
            <p className="text-muted-foreground text-sm font-golos mb-4">Неделя · Пн–Пт</p>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {DAYS.map((day, i) => (
                <button key={day} onClick={() => { setSelectedDay(day); setExpandedLesson(null); }}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-golos font-semibold text-sm transition-all duration-200 ${selectedDay === day ? 'text-white' : 'glass text-muted-foreground hover:text-foreground'}`}
                  style={selectedDay === day ? { background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' } : {}}>
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт'][i]}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {dayLessons.map(lesson => {
                const absence = absenceOnLesson(lesson);
                const isExpanded = expandedLesson === lesson.id;
                return (
                  <div key={lesson.id} className={`glass rounded-2xl overflow-hidden transition-all ${absence ? 'border-red-500/30' : 'glass-hover'}`}>
                    <button className="w-full p-4 flex items-center gap-4 text-left" onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-golos font-black text-sm flex-shrink-0"
                        style={{ background: absence ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.15)', color: absence ? '#ef4444' : '#3b82f6' }}>
                        {lesson.lesson}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-golos font-bold text-sm text-foreground truncate">{lesson.subject}</p>
                        <p className="font-golos text-xs text-muted-foreground">{lesson.time} · Каб. {lesson.room}</p>
                      </div>
                      {absence && (
                        <span className="text-xs font-golos font-semibold px-2 py-1 rounded-lg flex-shrink-0"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>Пропуск</span>
                      )}
                      <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground flex-shrink-0" />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-border/50 pt-3 animate-fade-in-scale">
                        <div className="flex items-center gap-2 text-sm font-golos text-muted-foreground mb-2">
                          <Icon name="User" size={14} />{lesson.teacher}
                        </div>
                        {absence && (
                          <div className="p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            <p className="font-golos font-semibold text-sm text-red-400 mb-1">❌ Занятие пропущено</p>
                            <p className="font-golos text-xs text-muted-foreground">{absence.reason ? `Причина: ${absence.reason}` : 'Причина не указана'}</p>
                            <p className="font-golos text-xs mt-1" style={{ color: absence.confirmed ? '#10b981' : '#f59e0b' }}>
                              {absence.confirmed ? '✓ Подтверждено' : '⏳ Ожидает подтверждения'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
              {dayLessons.length === 0 && (
                <div className="glass rounded-2xl p-8 text-center">
                  <p className="text-4xl mb-2">🎉</p>
                  <p className="font-golos font-semibold text-muted-foreground">Занятий нет</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABSENCES TAB */}
        {tab === 'absences' && (
          <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h2 className="font-golos font-black text-2xl mb-1">Мои пропуски</h2>
            <p className="text-muted-foreground text-sm font-golos mb-4">Статистика за неделю</p>

            <div className="glass rounded-2xl p-5 mb-4 glow-blue">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-golos text-sm text-muted-foreground mb-1">Всего пропущено</p>
                  <p className="font-golos font-black text-4xl gradient-text-blue">{student.absences.length}</p>
                  <p className="font-golos text-xs text-muted-foreground mt-1">занятий</p>
                </div>
                <div className="text-5xl animate-float">📊</div>
              </div>
            </div>

            {Object.keys(subjectStats).length > 0 && (
              <div className="space-y-3 mb-4">
                <h3 className="font-golos font-bold text-sm text-muted-foreground uppercase tracking-wider">По предметам</h3>
                {Object.entries(subjectStats).sort((a, b) => b[1] - a[1]).map(([subj, count]) => {
                  const max = Math.max(...Object.values(subjectStats));
                  return (
                    <div key={subj} className="glass rounded-2xl p-4">
                      <div className="flex justify-between items-center mb-2">
                        <p className="font-golos font-semibold text-sm">{subj}</p>
                        <span className="font-golos font-bold text-red-400">{count}</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full rounded-full progress-glow transition-all duration-700" style={{ width: `${(count / max) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <h3 className="font-golos font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Все пропуски</h3>
            {student.absences.length === 0 ? (
              <div className="glass rounded-2xl p-8 text-center">
                <p className="text-4xl mb-2">✨</p>
                <p className="font-golos font-semibold text-green-400">Нет пропусков!</p>
                <p className="font-golos text-xs text-muted-foreground mt-1">Отличная посещаемость</p>
              </div>
            ) : (
              <div className="space-y-2">
                {student.absences.map(a => (
                  <div key={a.id} className="glass rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="font-golos font-semibold text-sm">{a.subject}</p>
                      <p className="font-golos text-xs text-muted-foreground">{a.date} · Пара {a.lesson}</p>
                      {a.reason && <p className="font-golos text-xs text-blue-400 mt-0.5">{a.reason}</p>}
                    </div>
                    <span className="text-xs px-2 py-1 rounded-lg font-golos font-semibold"
                      style={{ background: a.confirmed ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: a.confirmed ? '#10b981' : '#ef4444' }}>
                      {a.confirmed ? 'Ув.' : 'Н/У'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* RATING TAB */}
        {tab === 'rating' && (
          <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h2 className="font-golos font-black text-2xl mb-1">Рейтинг</h2>
            <p className="text-muted-foreground text-sm font-golos mb-4">По посещаемости · Группа 211-Г</p>

            {myRank && (
              <div className="glass rounded-2xl p-4 mb-4 glow-purple flex items-center gap-4">
                <div className="text-3xl font-golos font-black gradient-text-purple">#{myRank.rank}</div>
                <div>
                  <p className="font-golos font-semibold text-sm">Твоё место в рейтинге</p>
                  <p className="font-golos text-xs text-muted-foreground">{myRank.absences.length} пропусков</p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {ranking.map((s, idx) => {
                const isMe = s.id === student.id;
                return (
                  <div key={s.id} className={`glass rounded-2xl p-4 flex items-center gap-4 transition-all ${isMe ? 'glow-blue' : ''}`}
                    style={isMe ? { borderColor: 'rgba(59,130,246,0.4)' } : {}}>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-golos font-black text-sm flex-shrink-0 ${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'glass'}`}>
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : s.rank}
                    </div>
                    <AvatarBadge emoji={s.avatar} color={s.color} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className={`font-golos font-bold text-sm truncate ${isMe ? 'gradient-text-blue' : 'text-foreground'}`}>
                        {s.nickname}{isMe && ' (Ты)'}
                      </p>
                      <p className="font-golos text-xs text-muted-foreground">{s.absences.length} пропусков</p>
                    </div>
                    <span className="font-golos font-black text-lg"
                      style={{ color: s.absences.length === 0 ? '#10b981' : s.absences.length <= 2 ? '#f59e0b' : '#ef4444' }}>
                      {s.absences.length}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab === 'profile' && (
          <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h2 className="font-golos font-black text-2xl mb-1">Профиль</h2>
            <p className="text-muted-foreground text-sm font-golos mb-6">Настройки аккаунта</p>

            <div className="glass rounded-2xl p-6 mb-4 text-center">
              <button onClick={() => setProfileAvatarPicker(!profileAvatarPicker)} className="relative inline-block">
                <AvatarBadge emoji={student.avatar} color={student.color} size={80} />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ background: '#3b82f6' }}>
                  <Icon name="Camera" size={14} />
                </div>
              </button>
              <p className="font-golos font-black text-xl mt-3 gradient-text-blue">{student.nickname}</p>
              <p className="font-golos text-xs text-muted-foreground">Псевдоним нельзя изменить</p>

              {profileAvatarPicker && (
                <div className="mt-4 animate-fade-in-scale">
                  <p className="font-golos text-xs text-muted-foreground mb-3 uppercase tracking-wider">Выбери аватар</p>
                  <div className="grid grid-cols-8 gap-2 mb-4">
                    {AVATARS.map(a => (
                      <button key={a} onClick={() => { onUpdateStudent({ ...student, avatar: a }); }}
                        className={`text-2xl p-2 rounded-xl transition-all hover:scale-110 ${student.avatar === a ? 'ring-2 ring-blue-400' : 'glass'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                  <p className="font-golos text-xs text-muted-foreground mb-2 uppercase tracking-wider">Цвет акцента</p>
                  <div className="flex gap-2 justify-center">
                    {COLORS.map(c => (
                      <button key={c} onClick={() => onUpdateStudent({ ...student, color: c })}
                        className={`w-8 h-8 rounded-full transition-all hover:scale-110 ${student.color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}`}
                        style={{ background: c }} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="glass rounded-2xl p-5 mb-4">
              <h3 className="font-golos font-bold text-sm mb-4 flex items-center gap-2">
                <Icon name="Lock" size={16} className="text-blue-400" />Изменить пароль
              </h3>
              <div className="space-y-3">
                <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Новый пароль"
                  className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground font-golos focus:outline-none input-glow text-sm" />
                <input type="password" value={newPass2} onChange={e => setNewPass2(e.target.value)} placeholder="Повторите пароль"
                  className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground font-golos focus:outline-none input-glow text-sm" />
                {passMsg && <p className={`font-golos text-sm ${passMsg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{passMsg}</p>}
                <button onClick={handlePassChange}
                  className="w-full py-3 rounded-xl font-golos font-bold text-white transition-all hover:scale-105 active:scale-95"
                  style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                  Сохранить
                </button>
              </div>
            </div>

            <div className="glass rounded-2xl p-4 mb-4 flex items-center justify-around">
              <div className="text-center">
                <p className="font-golos font-black text-2xl gradient-text-blue">{student.absences.length}</p>
                <p className="font-golos text-xs text-muted-foreground">Пропусков</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="font-golos font-black text-2xl gradient-text-purple">#{myRank?.rank}</p>
                <p className="font-golos text-xs text-muted-foreground">Рейтинг</p>
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="text-center">
                <p className="font-golos font-black text-2xl" style={{ color: '#10b981' }}>{SCHEDULE.length - student.absences.length}</p>
                <p className="font-golos text-xs text-muted-foreground">Посещено</p>
              </div>
            </div>

            <button onClick={onLogout} className="w-full py-3 rounded-xl font-golos font-semibold text-red-400 glass hover:bg-red-500/10 transition-all flex items-center justify-center gap-2">
              <Icon name="LogOut" size={16} />Выйти из аккаунта
            </button>
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div className="tab-nav fixed bottom-0 left-0 right-0 flex items-center justify-around px-2 py-2 z-50">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-200 ${tab === t.key ? 'text-white' : 'text-muted-foreground'}`}
            style={tab === t.key ? { background: 'rgba(59,130,246,0.2)' } : {}}>
            <Icon name={t.icon} fallback="Circle" size={20} className={tab === t.key ? 'text-blue-400' : ''} />
            <span className="font-golos font-semibold text-xs">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────

function AdminDashboard({ admin, students, admins, onLogout, onUpdateAdmin, onUpdateStudents, onUpdateAdmins }: {
  admin: Admin;
  students: Student[];
  admins: Admin[];
  onLogout: () => void;
  onUpdateAdmin: (a: Admin) => void;
  onUpdateStudents: (s: Student[]) => void;
  onUpdateAdmins: (a: Admin[]) => void;
}) {
  const [tab, setTab] = useState<AdminTab>('schedule');
  const [selectedDay, setSelectedDay] = useState(DAYS[0]);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [absenceModal, setAbsenceModal] = useState<ScheduleLesson | null>(null);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [absenceReason, setAbsenceReason] = useState('');
  const [managementView, setManagementView] = useState<'list' | 'editStudent' | 'editAdmin' | 'addStudent' | 'addAdmin'>('list');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [newStudentNick, setNewStudentNick] = useState('');
  const [newStudentPass, setNewStudentPass] = useState('');
  const [newAdminNick, setNewAdminNick] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [profileAvatarPicker, setProfileAvatarPicker] = useState(false);
  const [adminNewPass, setAdminNewPass] = useState('');
  const [adminNewPass2, setAdminNewPass2] = useState('');
  const [adminPassMsg, setAdminPassMsg] = useState('');
  const [adminNewName, setAdminNewName] = useState(admin.nickname);

  const dayLessons = SCHEDULE.filter(l => l.day === selectedDay);

  const getAbsencesForLesson = (lesson: ScheduleLesson) =>
    students.filter(s => s.absences.find(a => a.date === lesson.day && a.lesson === lesson.lesson));

  const handleAddAbsence = () => {
    if (selectedStudentIds.length === 0 || !absenceModal) return;
    const updated = students.map(s => {
      if (!selectedStudentIds.includes(s.id)) return s;
      const alreadyHas = s.absences.find(a => a.date === absenceModal.day && a.lesson === absenceModal.lesson);
      if (alreadyHas) return s;
      const newAbsence: Absence = {
        id: Date.now() + s.id,
        date: absenceModal.day,
        subject: absenceModal.subject,
        lesson: absenceModal.lesson,
        reason: absenceReason,
        confirmed: absenceReason.length > 0,
      };
      const notif: Notification = {
        id: Date.now() + s.id + 100,
        text: `Пропуск добавлен: ${absenceModal.subject} (${absenceModal.day})`,
        read: false,
        date: new Date().toLocaleDateString('ru'),
      };
      return { ...s, absences: [...s.absences, newAbsence], notifications: [...s.notifications, notif] };
    });
    onUpdateStudents(updated);
    setAbsenceModal(null);
    setSelectedStudentIds([]);
    setAbsenceReason('');
  };

  const handleRemoveAbsence = (studentId: number, absenceId: number) => {
    const updated = students.map(s => s.id !== studentId ? s : { ...s, absences: s.absences.filter(a => a.id !== absenceId) });
    onUpdateStudents(updated);
    if (editingStudent) {
      const upd = updated.find(s => s.id === editingStudent.id);
      if (upd) setEditingStudent(upd);
    }
  };

  const handleSaveStudent = () => {
    if (!editingStudent) return;
    onUpdateStudents(students.map(s => s.id === editingStudent.id ? editingStudent : s));
    setManagementView('list');
  };

  const handleAddStudent = () => {
    if (!newStudentNick || !newStudentPass) return;
    const newS: Student = {
      id: Date.now(), nickname: newStudentNick, password: newStudentPass,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      absences: [], notifications: [],
    };
    onUpdateStudents([...students, newS]);
    setNewStudentNick(''); setNewStudentPass('');
    setManagementView('list');
  };

  const handleAddAdmin = () => {
    if (!newAdminNick || !newAdminPass) return;
    const newA: Admin = { id: Date.now(), nickname: newAdminNick, password: newAdminPass, avatar: '🏫' };
    onUpdateAdmins([...admins, newA]);
    setNewAdminNick(''); setNewAdminPass('');
    setManagementView('list');
  };

  const handleAdminSave = () => {
    if (adminNewPass && adminNewPass !== adminNewPass2) { setAdminPassMsg('Пароли не совпадают'); return; }
    const updated = { ...admin, nickname: adminNewName, password: adminNewPass || admin.password };
    onUpdateAdmin(updated);
    setAdminNewPass(''); setAdminNewPass2('');
    setAdminPassMsg('✅ Сохранено!');
    setTimeout(() => setAdminPassMsg(''), 2500);
  };

  const ranking = [...students].sort((a, b) => a.absences.length - b.absences.length).map((s, i) => ({ ...s, rank: i + 1 }));

  const tabs: { key: AdminTab; icon: string; label: string }[] = [
    { key: 'schedule', icon: 'CalendarDays', label: 'Расписание' },
    { key: 'absences', icon: 'XCircle', label: 'Пропуски' },
    { key: 'rating', icon: 'Trophy', label: 'Рейтинг' },
    { key: 'management', icon: 'Settings', label: 'Управление' },
    { key: 'profile', icon: 'Shield', label: 'Профиль' },
  ];

  return (
    <div className="min-h-screen bg-animated flex flex-col" style={{ paddingBottom: 84 }}>
      <div className="glass sticky top-0 z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl" style={{ background: 'rgba(139,92,246,0.2)', border: '1.5px solid rgba(139,92,246,0.3)' }}>
            {admin.avatar}
          </div>
          <div>
            <p className="font-golos font-bold text-sm">{admin.nickname}</p>
            <p className="font-golos text-xs" style={{ color: '#8b5cf6' }}>Администратор</p>
          </div>
        </div>
        <button onClick={onLogout} className="p-2 glass rounded-xl hover:bg-red-500/10 transition-colors">
          <Icon name="LogOut" size={18} className="text-muted-foreground" />
        </button>
      </div>

      <div className="flex-1 px-4 pt-4 pb-2">

        {/* ADMIN SCHEDULE */}
        {tab === 'schedule' && (
          <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h2 className="font-golos font-black text-2xl mb-1">Расписание</h2>
            <p className="text-muted-foreground text-sm font-golos mb-4">Отметить пропуски · Группа 211-Г</p>

            <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
              {DAYS.map((day, i) => (
                <button key={day} onClick={() => { setSelectedDay(day); setExpandedLesson(null); }}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl font-golos font-semibold text-sm transition-all ${selectedDay === day ? 'text-white' : 'glass text-muted-foreground'}`}
                  style={selectedDay === day ? { background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' } : {}}>
                  {['Пн', 'Вт', 'Ср', 'Чт', 'Пт'][i]}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {dayLessons.map(lesson => {
                const absentStudents = getAbsencesForLesson(lesson);
                const isExpanded = expandedLesson === lesson.id;
                return (
                  <div key={lesson.id} className="glass rounded-2xl overflow-hidden">
                    <button className="w-full p-4 flex items-center gap-4 text-left" onClick={() => setExpandedLesson(isExpanded ? null : lesson.id)}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-golos font-black text-sm flex-shrink-0"
                        style={{ background: 'rgba(139,92,246,0.15)', color: '#8b5cf6' }}>
                        {lesson.lesson}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-golos font-bold text-sm truncate">{lesson.subject}</p>
                        <p className="font-golos text-xs text-muted-foreground">{lesson.time} · {lesson.teacher}</p>
                      </div>
                      {absentStudents.length > 0 && (
                        <span className="text-xs font-golos font-semibold px-2 py-1 rounded-lg flex-shrink-0"
                          style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>
                          {absentStudents.length} пропуска
                        </span>
                      )}
                      <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} className="text-muted-foreground" />
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-border/50 pt-3 animate-fade-in-scale">
                        {absentStudents.length > 0 && (
                          <div className="mb-3">
                            <p className="font-golos text-xs text-muted-foreground mb-2 uppercase tracking-wider">Отсутствовали:</p>
                            <div className="flex flex-wrap gap-2">
                              {absentStudents.map(s => (
                                <span key={s.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-golos"
                                  style={{ background: 'rgba(239,68,68,0.12)', color: '#ef4444' }}>
                                  {s.avatar} {s.nickname}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <button onClick={() => { setAbsenceModal(lesson); setSelectedStudentIds([]); setAbsenceReason(''); }}
                          className="flex items-center gap-2 text-sm font-golos font-semibold px-4 py-2 rounded-xl transition-all hover:scale-105"
                          style={{ background: 'rgba(139,92,246,0.2)', color: '#8b5cf6', border: '1px solid rgba(139,92,246,0.3)' }}>
                          <Icon name="Plus" size={14} />Отметить пропуск
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ADMIN ABSENCES */}
        {tab === 'absences' && (
          <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h2 className="font-golos font-black text-2xl mb-1">Пропуски</h2>
            <p className="text-muted-foreground text-sm font-golos mb-4">Статистика всей группы</p>
            <div className="glass rounded-2xl p-5 mb-4">
              <p className="font-golos text-sm text-muted-foreground mb-1">Всего пропусков в группе</p>
              <p className="font-golos font-black text-4xl gradient-text-purple">{students.reduce((acc, s) => acc + s.absences.length, 0)}</p>
            </div>
            <div className="space-y-3">
              {[...students].sort((a, b) => b.absences.length - a.absences.length).map(s => (
                <div key={s.id} className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <AvatarBadge emoji={s.avatar} color={s.color} size={36} />
                    <div className="flex-1">
                      <p className="font-golos font-bold text-sm">{s.nickname}</p>
                      <p className="font-golos text-xs text-muted-foreground">{s.absences.length} пропусков</p>
                    </div>
                    <span className="font-golos font-black text-lg"
                      style={{ color: s.absences.length === 0 ? '#10b981' : s.absences.length <= 2 ? '#f59e0b' : '#ef4444' }}>
                      {s.absences.length}
                    </span>
                  </div>
                  {s.absences.length > 0 && (
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full progress-glow" style={{ width: `${Math.min(100, (s.absences.length / 10) * 100)}%` }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN RATING */}
        {tab === 'rating' && (
          <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h2 className="font-golos font-black text-2xl mb-1">Рейтинг</h2>
            <p className="text-muted-foreground text-sm font-golos mb-4">По посещаемости · Группа 211-Г</p>
            <div className="space-y-3">
              {ranking.map((s, idx) => (
                <div key={s.id} className="glass rounded-2xl p-4 flex items-center gap-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-golos font-black text-sm flex-shrink-0 ${idx === 0 ? 'rank-1' : idx === 1 ? 'rank-2' : idx === 2 ? 'rank-3' : 'glass'}`}>
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : s.rank}
                  </div>
                  <AvatarBadge emoji={s.avatar} color={s.color} size={36} />
                  <div className="flex-1 min-w-0">
                    <p className="font-golos font-bold text-sm truncate">{s.nickname}</p>
                    <p className="font-golos text-xs text-muted-foreground">{s.absences.length} пропусков</p>
                  </div>
                  <span className="font-golos font-black text-lg"
                    style={{ color: s.absences.length === 0 ? '#10b981' : s.absences.length <= 2 ? '#f59e0b' : '#ef4444' }}>
                    {s.absences.length}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADMIN MANAGEMENT */}
        {tab === 'management' && (
          <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            {managementView === 'list' && (
              <>
                <h2 className="font-golos font-black text-2xl mb-1">Управление</h2>
                <p className="text-muted-foreground text-sm font-golos mb-4">Аккаунты группы 211-Г</p>
                <div className="flex gap-2 mb-5">
                  <button onClick={() => setManagementView('addStudent')}
                    className="flex-1 py-2.5 rounded-xl font-golos font-bold text-sm text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                    + Студент
                  </button>
                  <button onClick={() => setManagementView('addAdmin')}
                    className="flex-1 py-2.5 rounded-xl font-golos font-bold text-sm text-white transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                    + Администратор
                  </button>
                </div>
                <h3 className="font-golos font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Студенты ({students.length})</h3>
                <div className="space-y-2 mb-5">
                  {students.map(s => (
                    <button key={s.id} onClick={() => { setEditingStudent({ ...s }); setManagementView('editStudent'); }}
                      className="w-full glass glass-hover rounded-xl p-3 flex items-center gap-3 text-left transition-all">
                      <AvatarBadge emoji={s.avatar} color={s.color} size={36} />
                      <div className="flex-1 min-w-0">
                        <p className="font-golos font-semibold text-sm">{s.nickname}</p>
                        <p className="font-golos text-xs text-muted-foreground">{s.absences.length} пропусков</p>
                      </div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>
                <h3 className="font-golos font-bold text-sm text-muted-foreground uppercase tracking-wider mb-3">Администраторы ({admins.length})</h3>
                <div className="space-y-2">
                  {admins.map(a => (
                    <button key={a.id} onClick={() => { setEditingAdmin({ ...a }); setManagementView('editAdmin'); }}
                      className="w-full glass glass-hover rounded-xl p-3 flex items-center gap-3 text-left transition-all">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl glass">{a.avatar}</div>
                      <div className="flex-1"><p className="font-golos font-semibold text-sm">{a.nickname}</p></div>
                      <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {managementView === 'editStudent' && editingStudent && (
              <div className="animate-fade-in-scale" style={{ animationFillMode: 'forwards' }}>
                <button onClick={() => setManagementView('list')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 group font-golos font-medium">
                  <Icon name="ChevronLeft" size={18} className="group-hover:-translate-x-1 transition-transform" />Назад
                </button>
                <div className="glass rounded-2xl p-5 mb-3 flex items-center gap-4">
                  <AvatarBadge emoji={editingStudent.avatar} color={editingStudent.color} size={48} />
                  <div>
                    <p className="font-golos font-black text-lg">{editingStudent.nickname}</p>
                    <p className="font-golos text-xs text-muted-foreground">{editingStudent.absences.length} пропусков</p>
                  </div>
                </div>
                <div className="glass rounded-2xl p-5 mb-3">
                  <h3 className="font-golos font-bold text-sm mb-3 flex items-center gap-2"><Icon name="Lock" size={14} className="text-purple-400" />Пароль</h3>
                  <input type="text" value={editingStudent.password} onChange={e => setEditingStudent({ ...editingStudent, password: e.target.value })}
                    className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground font-golos focus:outline-none input-glow text-sm" />
                </div>
                <div className="glass rounded-2xl p-5 mb-3">
                  <h3 className="font-golos font-bold text-sm mb-3 flex items-center gap-2"><Icon name="XCircle" size={14} className="text-red-400" />Пропуски ({editingStudent.absences.length})</h3>
                  {editingStudent.absences.length === 0 ? (
                    <p className="font-golos text-xs text-muted-foreground">Нет пропусков</p>
                  ) : (
                    <div className="space-y-2">
                      {editingStudent.absences.map(a => (
                        <div key={a.id} className="flex items-center justify-between p-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)' }}>
                          <div>
                            <p className="font-golos text-sm font-semibold">{a.subject}</p>
                            <p className="font-golos text-xs text-muted-foreground">{a.date} · Пара {a.lesson}</p>
                          </div>
                          <button onClick={() => handleRemoveAbsence(editingStudent.id, a.id)} className="p-1.5 rounded-lg hover:bg-red-500/20 transition-colors">
                            <Icon name="X" size={14} className="text-red-400" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={handleSaveStudent}
                  className="w-full py-3 rounded-xl font-golos font-bold text-white transition-all hover:scale-105 mb-2"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                  Сохранить изменения
                </button>
                <button onClick={() => { onUpdateStudents(students.filter(s => s.id !== editingStudent.id)); setManagementView('list'); }}
                  className="w-full py-3 rounded-xl font-golos font-semibold text-red-400 glass hover:bg-red-500/10 transition-all">
                  Удалить студента
                </button>
              </div>
            )}

            {managementView === 'editAdmin' && editingAdmin && (
              <div className="animate-fade-in-scale" style={{ animationFillMode: 'forwards' }}>
                <button onClick={() => setManagementView('list')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 group font-golos font-medium">
                  <Icon name="ChevronLeft" size={18} className="group-hover:-translate-x-1 transition-transform" />Назад
                </button>
                <div className="glass rounded-2xl p-5 mb-3">
                  <h3 className="font-golos font-bold text-sm mb-3">Администратор: {editingAdmin.nickname}</h3>
                  <input type="text" value={editingAdmin.password} onChange={e => setEditingAdmin({ ...editingAdmin, password: e.target.value })}
                    placeholder="Новый пароль"
                    className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground font-golos focus:outline-none input-glow text-sm" />
                </div>
                <button onClick={() => { onUpdateAdmins(admins.map(a => a.id === editingAdmin.id ? editingAdmin : a)); setManagementView('list'); }}
                  className="w-full py-3 rounded-xl font-golos font-bold text-white transition-all hover:scale-105 mb-2"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                  Сохранить
                </button>
                {editingAdmin.id !== admin.id && (
                  <button onClick={() => { onUpdateAdmins(admins.filter(a => a.id !== editingAdmin.id)); setManagementView('list'); }}
                    className="w-full py-3 rounded-xl font-golos font-semibold text-red-400 glass hover:bg-red-500/10 transition-all">
                    Удалить администратора
                  </button>
                )}
              </div>
            )}

            {managementView === 'addStudent' && (
              <div className="animate-fade-in-scale" style={{ animationFillMode: 'forwards' }}>
                <button onClick={() => setManagementView('list')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 group font-golos font-medium">
                  <Icon name="ChevronLeft" size={18} className="group-hover:-translate-x-1 transition-transform" />Назад
                </button>
                <h2 className="font-golos font-black text-xl mb-4">Новый студент</h2>
                <div className="glass rounded-2xl p-5 space-y-3">
                  <input type="text" value={newStudentNick} onChange={e => setNewStudentNick(e.target.value)} placeholder="Псевдоним"
                    className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground font-golos focus:outline-none input-glow text-sm" />
                  <input type="text" value={newStudentPass} onChange={e => setNewStudentPass(e.target.value)} placeholder="Пароль"
                    className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground font-golos focus:outline-none input-glow text-sm" />
                  <button onClick={handleAddStudent} disabled={!newStudentNick || !newStudentPass}
                    className="w-full py-3 rounded-xl font-golos font-bold text-white disabled:opacity-50 transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
                    Добавить студента
                  </button>
                </div>
              </div>
            )}

            {managementView === 'addAdmin' && (
              <div className="animate-fade-in-scale" style={{ animationFillMode: 'forwards' }}>
                <button onClick={() => setManagementView('list')} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 group font-golos font-medium">
                  <Icon name="ChevronLeft" size={18} className="group-hover:-translate-x-1 transition-transform" />Назад
                </button>
                <h2 className="font-golos font-black text-xl mb-4">Новый администратор</h2>
                <div className="glass rounded-2xl p-5 space-y-3">
                  <input type="text" value={newAdminNick} onChange={e => setNewAdminNick(e.target.value)} placeholder="Псевдоним"
                    className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground font-golos focus:outline-none input-glow text-sm" />
                  <input type="text" value={newAdminPass} onChange={e => setNewAdminPass(e.target.value)} placeholder="Пароль"
                    className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground font-golos focus:outline-none input-glow text-sm" />
                  <button onClick={handleAddAdmin} disabled={!newAdminNick || !newAdminPass}
                    className="w-full py-3 rounded-xl font-golos font-bold text-white disabled:opacity-50 transition-all hover:scale-105"
                    style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                    Добавить администратора
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ADMIN PROFILE */}
        {tab === 'profile' && (
          <div className="animate-fade-in-up" style={{ animationFillMode: 'forwards' }}>
            <h2 className="font-golos font-black text-2xl mb-1">Профиль</h2>
            <p className="text-muted-foreground text-sm font-golos mb-6">Настройки аккаунта</p>

            <div className="glass rounded-2xl p-6 mb-4 text-center">
              <button onClick={() => setProfileAvatarPicker(!profileAvatarPicker)} className="relative inline-block">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto" style={{ background: 'rgba(139,92,246,0.2)', border: '1.5px solid rgba(139,92,246,0.3)' }}>
                  {admin.avatar}
                </div>
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white" style={{ background: '#8b5cf6' }}>
                  <Icon name="Camera" size={14} />
                </div>
              </button>
              <p className="font-golos font-black text-xl mt-3 gradient-text-purple">{admin.nickname}</p>
              <p className="font-golos text-xs text-muted-foreground">Администратор</p>

              {profileAvatarPicker && (
                <div className="mt-4 animate-fade-in-scale">
                  <div className="grid grid-cols-8 gap-2">
                    {AVATARS.map(a => (
                      <button key={a} onClick={() => { onUpdateAdmin({ ...admin, avatar: a }); setProfileAvatarPicker(false); }}
                        className={`text-2xl p-2 rounded-xl transition-all hover:scale-110 ${admin.avatar === a ? 'ring-2 ring-purple-400' : 'glass'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="glass rounded-2xl p-5 mb-3">
              <h3 className="font-golos font-bold text-sm mb-3 flex items-center gap-2"><Icon name="User" size={14} className="text-purple-400" />Псевдоним</h3>
              <input type="text" value={adminNewName} onChange={e => setAdminNewName(e.target.value)}
                className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground font-golos focus:outline-none input-glow text-sm" />
            </div>

            <div className="glass rounded-2xl p-5 mb-4">
              <h3 className="font-golos font-bold text-sm mb-3 flex items-center gap-2"><Icon name="Lock" size={14} className="text-purple-400" />Изменить пароль</h3>
              <div className="space-y-3">
                <input type="password" value={adminNewPass} onChange={e => setAdminNewPass(e.target.value)} placeholder="Новый пароль"
                  className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground font-golos focus:outline-none input-glow text-sm" />
                <input type="password" value={adminNewPass2} onChange={e => setAdminNewPass2(e.target.value)} placeholder="Повторите пароль"
                  className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground font-golos focus:outline-none input-glow text-sm" />
                {adminPassMsg && <p className={`font-golos text-sm ${adminPassMsg.startsWith('✅') ? 'text-green-400' : 'text-red-400'}`}>{adminPassMsg}</p>}
                <button onClick={handleAdminSave}
                  className="w-full py-3 rounded-xl font-golos font-bold text-white transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                  Сохранить всё
                </button>
              </div>
            </div>

            <button onClick={onLogout} className="w-full py-3 rounded-xl font-golos font-semibold text-red-400 glass hover:bg-red-500/10 transition-all flex items-center justify-center gap-2">
              <Icon name="LogOut" size={16} />Выйти из аккаунта
            </button>
          </div>
        )}
      </div>

      {/* Absence Modal */}
      {absenceModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
          onClick={e => { if (e.target === e.currentTarget) setAbsenceModal(null); }}>
          <div className="w-full max-w-sm glass rounded-t-3xl p-6 animate-slide-in-bottom" style={{ animationFillMode: 'forwards' }}>
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mb-4" />
            <h3 className="font-golos font-black text-lg mb-1">Отметить пропуск</h3>
            <p className="font-golos text-sm text-muted-foreground mb-4">
              {absenceModal.subject} · {absenceModal.day} · Пара {absenceModal.lesson}
            </p>

            <p className="font-golos text-xs text-muted-foreground uppercase tracking-wider mb-2">Выберите студентов:</p>
            <div className="space-y-2 mb-4 max-h-44 overflow-y-auto">
              {students.map(s => {
                const alreadyAbsent = s.absences.find(a => a.date === absenceModal.day && a.lesson === absenceModal.lesson);
                return (
                  <button key={s.id} disabled={!!alreadyAbsent}
                    onClick={() => setSelectedStudentIds(prev => prev.includes(s.id) ? prev.filter(id => id !== s.id) : [...prev, s.id])}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${alreadyAbsent ? 'opacity-40' : selectedStudentIds.includes(s.id) ? 'ring-2 ring-purple-400' : 'glass glass-hover'}`}
                    style={selectedStudentIds.includes(s.id) ? { background: 'rgba(139,92,246,0.15)' } : {}}>
                    <AvatarBadge emoji={s.avatar} color={s.color} size={30} />
                    <span className="font-golos font-semibold text-sm flex-1">{s.nickname}</span>
                    {alreadyAbsent && <span className="font-golos text-xs text-red-400">Уже отмечен</span>}
                    {selectedStudentIds.includes(s.id) && <Icon name="Check" size={14} className="text-purple-400" />}
                  </button>
                );
              })}
            </div>

            <p className="font-golos text-xs text-muted-foreground uppercase tracking-wider mb-2">Причина (необязательно):</p>
            <input type="text" value={absenceReason} onChange={e => setAbsenceReason(e.target.value)}
              placeholder="Болезнь, соревнования..."
              className="w-full bg-secondary/60 border border-border rounded-xl px-4 py-3 text-foreground font-golos focus:outline-none input-glow text-sm mb-4" />

            <div className="flex gap-2">
              <button onClick={() => setAbsenceModal(null)} className="flex-1 py-3 rounded-xl font-golos font-semibold text-muted-foreground glass">
                Отмена
              </button>
              <button onClick={handleAddAbsence} disabled={selectedStudentIds.length === 0}
                className="flex-1 py-3 rounded-xl font-golos font-bold text-white disabled:opacity-50 transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
                Отметить
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab Bar */}
      <div className="tab-nav fixed bottom-0 left-0 right-0 flex items-center justify-around px-1 py-2 z-50">
        {tabs.map(t => (
          <button key={t.key} onClick={() => { setTab(t.key); setManagementView('list'); }}
            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-200 ${tab === t.key ? 'text-white' : 'text-muted-foreground'}`}
            style={tab === t.key ? { background: 'rgba(139,92,246,0.2)' } : {}}>
            <Icon name={t.icon} fallback="Circle" size={18} className={tab === t.key ? 'text-purple-400' : ''} />
            <span className="font-golos font-semibold" style={{ fontSize: 10 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function Index() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null);
  const [students, setStudents] = useState<Student[]>(initStudents);
  const [admins, setAdmins] = useState<Admin[]>(initAdmins);

  const handleRole = (r: 'student' | 'admin') => {
    setRole(r);
    setScreen(r === 'student' ? 'student-login' : 'admin-login');
  };

  const handleStudentLogin = (s: Student) => { setCurrentStudent(s); setScreen('student-dashboard'); };
  const handleAdminLogin = (a: Admin) => { setCurrentAdmin(a); setScreen('admin-dashboard'); };

  const handleUpdateStudent = (updated: Student) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
    setCurrentStudent(updated);
  };

  const handleUpdateStudents = (updated: Student[]) => {
    setStudents(updated);
    if (currentStudent) {
      const s = updated.find(s => s.id === currentStudent.id);
      if (s) setCurrentStudent(s);
    }
  };

  const handleUpdateAdmin = (updated: Admin) => {
    setAdmins(prev => prev.map(a => a.id === updated.id ? updated : a));
    setCurrentAdmin(updated);
  };

  const handleLogout = () => { setCurrentStudent(null); setCurrentAdmin(null); setScreen('landing'); };

  return (
    <>
      {screen === 'landing' && <LandingScreen onRole={handleRole} />}

      {(screen === 'student-login' || screen === 'admin-login') && (
        <LoginScreen
          role={role} students={students} admins={admins}
          onStudentLogin={handleStudentLogin} onAdminLogin={handleAdminLogin}
          onBack={() => setScreen('landing')}
        />
      )}

      {screen === 'student-dashboard' && currentStudent && (
        <StudentDashboard
          student={students.find(s => s.id === currentStudent.id) || currentStudent}
          students={students}
          onLogout={handleLogout}
          onUpdateStudent={handleUpdateStudent}
        />
      )}

      {screen === 'admin-dashboard' && currentAdmin && (
        <AdminDashboard
          admin={admins.find(a => a.id === currentAdmin.id) || currentAdmin}
          students={students} admins={admins}
          onLogout={handleLogout}
          onUpdateAdmin={handleUpdateAdmin}
          onUpdateStudents={handleUpdateStudents}
          onUpdateAdmins={setAdmins}
        />
      )}
    </>
  );
}