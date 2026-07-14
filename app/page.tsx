"use client";

import {
  Activity,
  Bell,
  Brain,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  FileAudio,
  FileText,
  Footprints,
  Home,
  ListChecks,
  LoaderCircle,
  LockKeyhole,
  MapPin,
  MessageCircle,
  Mic,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Settings,
  Sparkles,
  Star,
  Trophy,
  Upload,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

type MainView = "home" | "records" | "memories" | "ai";
type View = MainView | "upload" | "processing";
type Profile = "teen" | "young" | "mature" | "senior";

type TaskItem = {
  id: number;
  title: string;
  time: string;
  source: string;
  done: boolean;
};

type RecordItem = { title: string; meta: string; person: string; status: string; tone: string };
type MemoryItem = { title: string; type: string; source: string; state: string };
type ScheduleItem = { time: string; title: string; place: string };
type ProfileContent = {
  greeting: string;
  intro: string;
  briefTitle: string;
  briefNote: string;
  tasks: TaskItem[];
  schedules: ScheduleItem[];
  recent: { title: string; meta: string; result: string };
  insight: { title: string; body: string; followup: string };
  records: RecordItem[];
  memories: MemoryItem[];
  prompts: string[];
  aiReply: string;
};

const profileOptions: Array<{ id: Profile; label: string; note: string; reference: string }> = [
  { id: "teen", label: "10대 이하", note: "친근하고 재미있게", reference: "레퍼런스 V4" },
  { id: "young", label: "20–39", note: "빠르고 간결하게", reference: "레퍼런스 V1" },
  { id: "mature", label: "40–59", note: "명확하고 안정적으로", reference: "레퍼런스 V5" },
  { id: "senior", label: "60대 이상", note: "크고 아주 단순하게", reference: "큰 글씨 전용" },
];

const profileContent: Record<Profile, ProfileContent> = {
  teen: {
    greeting: "오늘도 같이 해볼까요? ✨",
    intro: "운동 모임과 해야 할 일을 쉽고 재미있게 모았어요.",
    briefTitle: "오늘은 운동 약속 1개와\n할 일 3개가 있어요!",
    briefNote: "작은 실천부터 하나씩 완료해 봐요.",
    tasks: [
      { id: 1, title: "농구 동아리 운동화 챙기기", time: "오후 3:30", source: "농구 동아리 대화", done: false },
      { id: 2, title: "친구들과 풋살 시간 확인하기", time: "오후 5:00", source: "주말 풋살 모임", done: true },
      { id: 3, title: "잠들기 전 스트레칭 10분", time: "오후 9:00", source: "건강 습관", done: false },
    ],
    schedules: [
      { time: "오후 4:00", title: "농구 동아리 연습", place: "학교 체육관" },
      { time: "오후 7:30", title: "온라인 게임 모임", place: "친구들과" },
    ],
    recent: { title: "주말 풋살 모임 대화", meta: "7월 12일 · 8분 20초 · 정리 완료", result: "할 일 2개" },
    insight: { title: "운동 전 준비물을\n미리 챙기면 좋아요.", body: "최근 모임에서 운동화와 물병 이야기가 두 번 나왔어요.", followup: "농구 연습 준비물 확인" },
    records: [
      { title: "주말 풋살 모임 대화", meta: "7월 12일 · 8분 20초", person: "친구 4명", status: "정리 완료", tone: "done" },
      { title: "농구 동아리 연습 공지", meta: "7월 11일 · 3분 15초", person: "코치", status: "확인 필요", tone: "check" },
      { title: "스트레칭 계획 음성 메모", meta: "7월 10일 · 1분 42초", person: "나", status: "분석 완료", tone: "done" },
    ],
    memories: [
      { title: "토요일 오후에는 친구들과 풋살을 함", type: "운동", source: "풋살 모임 대화", state: "직접 확인" },
      { title: "농구 연습 때 개인 물병이 필요함", type: "준비물", source: "동아리 공지", state: "직접 확인" },
      { title: "짧고 재미있는 운동 목표를 더 잘 완료하는 편", type: "습관", source: "완료 기록 6건", state: "AI 추정" },
    ],
    prompts: ["오늘 운동 약속 알려줘", "풋살 준비물 정리해줘", "이번 주 운동 목표 보여줘"],
    aiReply: "오늘은 오후 4시 농구 동아리 연습이 가장 먼저예요. 운동화와 물병을 미리 챙기면 준비 완료입니다!",
  },
  young: {
    greeting: "좋은 오후입니다.",
    intro: "오늘 중요한 운동 일정과 실행할 일만 정리했습니다.",
    briefTitle: "남은 할 일은 2개,\n오늘 운동 일정은 2개입니다.",
    briefNote: "모임 대화에서 아직 끝나지 않은 행동을 찾았습니다.",
    tasks: [
      { id: 1, title: "러닝 동호회 참가 신청", time: "오전 10:00", source: "한강 러닝크루 대화", done: false },
      { id: 2, title: "헬스장 PT 일정 확인", time: "오후 2:00", source: "트레이너 통화", done: true },
      { id: 3, title: "배드민턴 라켓 챙기기", time: "오후 6:30", source: "직장인 배드민턴 모임", done: false },
    ],
    schedules: [
      { time: "오후 7:00", title: "배드민턴 정기 모임", place: "잠실 체육관" },
      { time: "오후 9:00", title: "러닝크루 코스 회의", place: "온라인" },
    ],
    recent: { title: "한강 러닝크루 운영진 통화", meta: "7월 12일 · 12분 18초 · 분석 완료", result: "할 일 3개" },
    insight: { title: "신청보다 실제 참여율이\n낮아지고 있습니다.", body: "최근 한 달간 운동 모임 신청 6건 중 실제 참여는 3건이었어요.", followup: "러닝크루 참가 확정" },
    records: [
      { title: "한강 러닝크루 운영진 통화", meta: "7월 12일 · 12분 18초", person: "운영진", status: "분석 완료", tone: "done" },
      { title: "배드민턴 정기 모임 대화", meta: "7월 11일 · 9분 04초", person: "회원 3명", status: "화자 확인 필요", tone: "check" },
      { title: "PT 상담 통화", meta: "7월 9일 · 6분 31초", person: "트레이너", status: "AI 분석 중", tone: "working" },
    ],
    memories: [
      { title: "매주 수요일 저녁 배드민턴 모임에 참여함", type: "일정", source: "모임 대화 3건", state: "직접 확인" },
      { title: "러닝 모임은 5km 초급 코스를 선호함", type: "선호", source: "운영진 통화", state: "직접 확인" },
      { title: "저녁 약속이 연속되면 운동을 미루는 경향", type: "패턴", source: "일정 8건", state: "AI 추정" },
    ],
    prompts: ["오늘 중요한 일 알려줘", "러닝크루 대화 요약해줘", "이번 달 운동 패턴 찾아줘"],
    aiReply: "가장 먼저 할 일은 한강 러닝크루 참가 신청입니다. 오늘 오전까지 신청하기로 한 운영진 대화를 근거로 확인했어요.",
  },
  mature: {
    greeting: "오늘 일정을 확인하세요.",
    intro: "운동 모임, 준비 사항, 완료 여부를 한눈에 정리했습니다.",
    briefTitle: "오늘 할 일 3건 중\n1건을 완료했습니다.",
    briefNote: "중요도와 시간 순서에 따라 목록을 정리했습니다.",
    tasks: [
      { id: 1, title: "토요 등산 모임 코스 확인", time: "오전 9:00", source: "산악회 공지", done: true },
      { id: 2, title: "수영 강습 일정 등록", time: "오후 1:00", source: "수영장 상담", done: false },
      { id: 3, title: "걷기 모임 회비 납부", time: "오후 5:00", source: "동네 걷기 모임", done: false },
    ],
    schedules: [
      { time: "오후 3:00", title: "수영 강습 상담", place: "구민체육센터" },
      { time: "오후 6:30", title: "동네 걷기 모임", place: "호수공원 입구" },
    ],
    recent: { title: "토요 산악회 코스 안내", meta: "7월 12일 · 14분 05초 · 분석 완료", result: "결정 2개" },
    insight: { title: "이번 주 운동 일정이\n하루에 집중돼 있습니다.", body: "토요일에 등산과 걷기 일정이 겹칠 가능성이 있습니다.", followup: "토요일 모임 시간 조정" },
    records: [
      { title: "토요 산악회 코스 안내", meta: "7월 12일 · 14분 05초", person: "총무", status: "분석 완료", tone: "done" },
      { title: "구민체육센터 수영 상담", meta: "7월 10일 · 7분 44초", person: "상담원", status: "확인 필요", tone: "check" },
      { title: "동네 걷기 모임 공지", meta: "7월 8일 · 4분 16초", person: "회원 5명", status: "분석 완료", tone: "done" },
    ],
    memories: [
      { title: "매월 둘째 주 토요일 산악회 정기 산행", type: "일정", source: "산악회 공지", state: "직접 확인" },
      { title: "무릎 부담이 적은 수영과 걷기를 선호함", type: "선호", source: "상담 기록 2건", state: "직접 확인" },
      { title: "오전 운동 일정의 완료율이 높음", type: "패턴", source: "완료 기록 12건", state: "AI 추정" },
    ],
    prompts: ["오늘 일정 순서대로 알려줘", "산악회 준비물 정리해줘", "겹치는 운동 일정 확인해줘"],
    aiReply: "수영 강습 일정 등록이 아직 남아 있습니다. 오늘 오후 1시까지 등록하기로 한 상담 내용을 기준으로 정리했습니다.",
  },
  senior: {
    greeting: "오늘도 건강하게 보내세요.",
    intro: "꼭 필요한 운동 일정만 크게 보여드립니다.",
    briefTitle: "오늘 할 일은\n두 가지입니다.",
    briefNote: "완료하면 큰 체크 버튼을 눌러주세요.",
    tasks: [
      { id: 1, title: "오전 걷기 모임 가기", time: "오전 10시", source: "동네 친구 모임", done: false },
      { id: 2, title: "물병 챙기기", time: "출발 전", source: "걷기 준비", done: false },
    ],
    schedules: [
      { time: "오전 10시", title: "공원 걷기", place: "아파트 정문" },
    ],
    recent: { title: "공원 걷기 모임 안내", meta: "어제 · 내용 정리 완료", result: "약속 1개" },
    insight: { title: "아침에 물을\n챙겨 두세요.", body: "걷기 전에 물을 준비하면 좋습니다.", followup: "물병 챙기기" },
    records: [
      { title: "공원 걷기 모임 안내", meta: "어제 · 3분", person: "모임 친구", status: "정리 완료", tone: "done" },
      { title: "체조 교실 시간 안내", meta: "7월 10일 · 2분", person: "복지관", status: "정리 완료", tone: "done" },
    ],
    memories: [
      { title: "화요일과 목요일에 공원을 걷습니다", type: "운동", source: "직접 확인", state: "직접 확인" },
      { title: "오전 10시에 아파트 정문에서 만납니다", type: "약속", source: "걷기 모임", state: "직접 확인" },
    ],
    prompts: ["오늘 할 일", "걷기 모임 시간", "준비물"],
    aiReply: "오늘 오전 10시에 아파트 정문에서 걷기 모임이 있습니다. 출발 전에 물병을 챙겨주세요.",
  },
};

const navItems: Array<{ id: MainView; label: string; icon: typeof Home }> = [
  { id: "home", label: "홈", icon: Home },
  { id: "records", label: "기록", icon: FileText },
  { id: "memories", label: "기억", icon: Brain },
  { id: "ai", label: "AI 대화", icon: MessageCircle },
];


function LogoMark() {
  return (
    <span className="logo-mark" aria-hidden="true">
      <span />
      <span />
    </span>
  );
}

function LifeMascot({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`life-mascot ${compact ? "compact" : ""}`} aria-hidden="true">
      <span className="mascot-spark one" />
      <span className="mascot-spark two" />
      <span className="mascot-body">
        <span className="mascot-eye left" />
        <span className="mascot-eye right" />
        <span className="mascot-smile" />
        <span className="mascot-cheek left" />
        <span className="mascot-cheek right" />
      </span>
      <span className="mascot-shadow" />
    </span>
  );
}

function formatBytes(bytes: number) {
  if (!bytes) return "0 MB";
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function formatDuration(seconds: number | null) {
  if (!seconds || !Number.isFinite(seconds)) return "파일에서 확인 중";
  const minutes = Math.floor(seconds / 60);
  const remains = Math.floor(seconds % 60);
  return `${minutes}분 ${remains.toString().padStart(2, "0")}초`;
}

export default function HomePage() {
  const [view, setView] = useState<View>("home");
  const [lastMainView, setLastMainView] = useState<MainView>("home");
  const [profile, setProfile] = useState<Profile>("young");
  const [pendingProfile, setPendingProfile] = useState<Profile | null>(null);
  const [profilePickerOpen, setProfilePickerOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>(profileContent.young.tasks);
  const [addOpen, setAddOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [recordTitle, setRecordTitle] = useState("");
  const [participants, setParticipants] = useState("2명");
  const [joined, setJoined] = useState("예");
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processDone, setProcessDone] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: "ai", text: "안녕하세요. 저장된 기록을 바탕으로 무엇을 확인할까요?" },
  ]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("life-os-profile", profile);
  }, [profile]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(""), 2200);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const completedCount = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const currentProfile = profileOptions.find((item) => item.id === profile)!;
  const currentContent = profileContent[profile];

  function requestProfileChange(next: Profile) {
    if (next === profile) {
      setProfilePickerOpen(false);
      setToast("현재 적용 중인 맞춤 보기입니다.");
      return;
    }
    setProfilePickerOpen(false);
    setPendingProfile(next);
  }

  function confirmProfileChange() {
    if (!pendingProfile) return;
    setProfile(pendingProfile);
    setTasks(profileContent[pendingProfile].tasks.map((task) => ({ ...task })));
    setChatMessages([{ role: "ai", text: "안녕하세요. 운동 모임과 기록을 바탕으로 무엇을 확인할까요?" }]);
    setView("home");
    setLastMainView("home");
    setPendingProfile(null);
    setToast("맞춤 보기가 전체 화면에 적용되었습니다.");
  }

  function goTo(next: MainView) {
    setView(next);
    setLastMainView(next);
    setAddOpen(false);
  }

  function toggleTask(id: number) {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)));
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const allowed = ["audio/mpeg", "audio/mp4", "audio/x-m4a", "audio/wav", "video/mp4"];
    const extensionAllowed = /\.(mp3|m4a|wav|mp4)$/i.test(file.name);
    if (!allowed.includes(file.type) && !extensionAllowed) {
      setToast("mp3, m4a, wav, mp4 파일만 선택할 수 있어요.");
      event.target.value = "";
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setToast("무료 테스트에서는 25MB 이하 파일을 선택해 주세요.");
      event.target.value = "";
      return;
    }
    setSelectedFile(file);
    setRecordTitle(file.name.replace(/\.[^/.]+$/, ""));
    setDuration(null);
    const media = document.createElement("audio");
    const url = URL.createObjectURL(file);
    media.preload = "metadata";
    media.onloadedmetadata = () => {
      setDuration(media.duration);
      URL.revokeObjectURL(url);
    };
    media.onerror = () => URL.revokeObjectURL(url);
    media.src = url;
  }

  function startUpload(event: FormEvent) {
    event.preventDefault();
    if (!selectedFile || !privacyChecked) return;
    setProgress(6);
    setProcessDone(false);
    setView("processing");
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(100, current + Math.ceil(Math.random() * 10));
        if (next >= 100) {
          if (timerRef.current) clearInterval(timerRef.current);
          window.setTimeout(() => setProcessDone(true), 650);
        }
        return next;
      });
    }, 380);
  }

  function sendChat(text?: string) {
    const message = (text ?? chatInput).trim();
    if (!message) return;
    setChatMessages((items) => [
      ...items,
      { role: "user", text: message },
      {
        role: "ai",
        text: currentContent.aiReply,
      },
    ]);
    setChatInput("");
  }

  return (
    <div className="app-shell" data-profile={profile}>
      <aside className="sidebar">
        <button className="brand" onClick={() => goTo("home")} aria-label="Life OS 홈">
          <LogoMark />
          <span>
            <strong>Life OS</strong>
            <small>나의 삶을 연결하는 AI</small>
          </span>
        </button>

        <nav className="side-nav" aria-label="주요 메뉴">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => goTo(item.id)}>
                <Icon size={20} strokeWidth={1.9} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button onClick={() => setToast("설정 화면은 다음 단계에서 연결합니다.")}>
            <Settings size={20} strokeWidth={1.9} />
            <span>설정</span>
          </button>
        </nav>

        <section className="profile-switcher" aria-labelledby="profile-title">
          <div className="profile-heading">
            <span id="profile-title">사용자 맞춤 보기</span>
            <CircleHelp size={15} />
          </div>
          <div className="profile-grid">
            {profileOptions.map((option) => (
              <button
                key={option.id}
                className={profile === option.id ? "active" : ""}
                onClick={() => requestProfileChange(option.id)}
                title={option.note}
              >
                {option.label}
              </button>
            ))}
          </div>
          <p>{currentProfile.reference} · {currentProfile.note}</p>
        </section>

        <div className="privacy-note">
          <LockKeyhole size={17} />
          <span>내 기록은 내가 관리합니다.</span>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="mobile-brand">
            <LogoMark />
            <strong>Life OS</strong>
          </div>
          <div className="desktop-page-title">
            <span>{view === "home" ? "오늘" : view === "records" ? "기록" : view === "memories" ? "기억" : view === "ai" ? "AI 대화" : "통화 기록"}</span>
            <small>{currentProfile.note}</small>
          </div>
          <div className="top-actions">
            <button className="profile-quick" aria-label="사용자 맞춤 보기 선택" onClick={() => setProfilePickerOpen(true)}>
              <UserRound size={17} /><span>맞춤 보기</span>
            </button>
            <button aria-label="검색" onClick={() => setToast("통합 검색은 다음 화면에서 연결합니다.")}><Search size={20} /></button>
            <button aria-label="알림" className="notification-button" onClick={() => setToast("새로운 확인 요청이 1개 있어요.")}>
              <Bell size={20} />
              <span />
            </button>
            <button className="avatar" aria-label="내 프로필"><UserRound size={18} /></button>
          </div>
        </header>

        <div className="content-wrap">
          {view === "home" && (
            <HomeView
              tasks={tasks}
              completedCount={completedCount}
              content={currentContent}
              profile={profile}
              toggleTask={toggleTask}
              onAdd={() => setAddOpen(true)}
              onWhy={() => setWhyOpen(true)}
              onRecords={() => goTo("records")}
            />
          )}
          {view === "records" && <RecordsView records={currentContent.records} onUpload={() => setAddOpen(true)} />}
          {view === "memories" && <MemoriesView memoryItems={currentContent.memories} />}
          {view === "ai" && (
            <AiView
              messages={chatMessages}
              input={chatInput}
              prompts={currentContent.prompts}
              setInput={setChatInput}
              onSend={sendChat}
            />
          )}
          {view === "upload" && (
            <UploadView
              file={selectedFile}
              duration={duration}
              title={recordTitle}
              setTitle={setRecordTitle}
              participants={participants}
              setParticipants={setParticipants}
              joined={joined}
              setJoined={setJoined}
              privacyChecked={privacyChecked}
              setPrivacyChecked={setPrivacyChecked}
              onFile={handleFile}
              onBack={() => setView(lastMainView)}
              onSubmit={startUpload}
            />
          )}
          {view === "processing" && (
            <ProcessingView
              progress={progress}
              done={processDone}
              title={recordTitle || selectedFile?.name || "새 통화"}
              onHome={() => goTo("home")}
              onRecords={() => goTo("records")}
            />
          )}
        </div>
      </main>

      <nav className="mobile-tabbar" aria-label="모바일 메뉴">
        <button className={view === "home" ? "active" : ""} onClick={() => goTo("home")}><Home /><span>홈</span></button>
        <button className={view === "records" ? "active" : ""} onClick={() => goTo("records")}><FileText /><span>기록</span></button>
        <button className="mobile-add" aria-label="기록 추가" onClick={() => setAddOpen(true)}><Plus /></button>
        <button className={view === "memories" ? "active" : ""} onClick={() => goTo("memories")}><Brain /><span>기억</span></button>
        <button className={view === "ai" ? "active" : ""} onClick={() => goTo("ai")}><MessageCircle /><span>AI</span></button>
      </nav>

      {profilePickerOpen && (
        <div className="overlay centered" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setProfilePickerOpen(false)}>
          <section className="profile-picker-modal" role="dialog" aria-modal="true" aria-labelledby="profile-picker-title">
            <button className="modal-close" aria-label="닫기" onClick={() => setProfilePickerOpen(false)}><X /></button>
            <span className="eyebrow">사용자 맞춤 보기</span>
            <h2 id="profile-picker-title">어떤 화면이 편한가요?</h2>
            <p>연령 구간을 선택하면 정보량과 화면 구성이 함께 바뀝니다.</p>
            <div className="profile-choice-list">
              {profileOptions.map((option) => (
                <button key={option.id} className={profile === option.id ? "active" : ""} onClick={() => requestProfileChange(option.id)}>
                  <span className={`profile-swatch ${option.id}`} aria-hidden="true" />
                  <span><strong>{option.label}</strong><small>{option.reference} · {option.note}</small></span>
                  {profile === option.id ? <CheckCircle2 /> : <ChevronRight />}
                </button>
              ))}
            </div>
          </section>
        </div>
      )}

      {pendingProfile && (
        <div className="overlay centered" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setPendingProfile(null)}>
          <section className="profile-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="profile-confirm-title">
            <div className={`profile-confirm-visual ${pendingProfile}`}>{pendingProfile === "teen" ? <LifeMascot compact /> : <UserRound />}</div>
            <span className="eyebrow">{profileOptions.find((item) => item.id === pendingProfile)?.label} 맞춤 보기</span>
            <h2 id="profile-confirm-title">전체 디자인 및 목록들이 수정됩니다.<br />변경할까요?</h2>
            <p>색상, 글자 크기, 카드 구성, 메뉴와 예시 목록이 한 번에 변경됩니다.</p>
            <div className="profile-confirm-actions">
              <button className="secondary-button" onClick={() => setPendingProfile(null)}>취소</button>
              <button className="primary-button" onClick={confirmProfileChange}>변경</button>
            </div>
          </section>
        </div>
      )}

      {addOpen && (
        <div className="overlay" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setAddOpen(false)}>
          <section className="bottom-sheet" role="dialog" aria-modal="true" aria-labelledby="add-title">
            <div className="sheet-handle" />
            <div className="sheet-header">
              <div>
                <span className="eyebrow">새 기록</span>
                <h2 id="add-title">무엇을 기록할까요?</h2>
              </div>
              <button aria-label="닫기" onClick={() => setAddOpen(false)}><X /></button>
            </div>
            <div className="add-options">
              <button onClick={() => { setAddOpen(false); setView("upload"); }}>
                <span className="option-icon blue"><FileAudio /></span>
                <span><strong>통화 녹음 가져오기</strong><small>통화 내용을 정리하고 싶을 때</small></span>
                <ChevronRight />
              </button>
              <button onClick={() => setToast("음성 기록은 준비 중이에요.")}>
                <span className="option-icon mint"><Mic /></span>
                <span><strong>지금 말로 기록하기</strong><small>생각이나 감정을 바로 남길 때</small></span>
                <span className="coming">준비 중</span>
              </button>
              <button onClick={() => setToast("직접 메모는 준비 중이에요.")}>
                <span className="option-icon violet"><FileText /></span>
                <span><strong>직접 메모 작성하기</strong><small>아이디어와 내용을 글로 남길 때</small></span>
                <span className="coming">준비 중</span>
              </button>
              <button onClick={() => setToast("할 일 추가는 준비 중이에요.")}>
                <span className="option-icon orange"><ListChecks /></span>
                <span><strong>할 일 추가</strong><small>해야 할 일을 바로 저장할 때</small></span>
                <span className="coming">준비 중</span>
              </button>
              <button onClick={() => setToast("일정 추가는 준비 중이에요.")}>
                <span className="option-icon soft"><CalendarDays /></span>
                <span><strong>일정 추가</strong><small>날짜와 시간이 있는 약속을 저장할 때</small></span>
                <span className="coming">준비 중</span>
              </button>
            </div>
          </section>
        </div>
      )}

      {whyOpen && (
        <div className="overlay centered" role="presentation" onMouseDown={(event) => event.currentTarget === event.target && setWhyOpen(false)}>
          <section className="reason-modal" role="dialog" aria-modal="true" aria-labelledby="reason-title">
            <div className="modal-icon"><Sparkles /></div>
            <button className="modal-close" aria-label="닫기" onClick={() => setWhyOpen(false)}><X /></button>
            <span className="eyebrow">분석 근거</span>
            <h2 id="reason-title">왜 이렇게 판단했나요?</h2>
            <p>{currentContent.insight.body}</p>
            <div className="evidence-list">
              <div><FileAudio /><span><strong>{currentContent.records[0].title}</strong><small>{currentContent.records[0].meta}</small></span></div>
              <div><FileText /><span><strong>{currentContent.tasks[0].title}</strong><small>{currentContent.tasks[0].source}</small></span></div>
            </div>
            <div className="fact-label"><CheckCircle2 /> 확인된 기록만 사용했습니다.</div>
          </section>
        </div>
      )}

      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}

function HomeView({
  tasks,
  completedCount,
  content,
  profile,
  toggleTask,
  onAdd,
  onWhy,
  onRecords,
}: {
  tasks: TaskItem[];
  completedCount: number;
  content: ProfileContent;
  profile: Profile;
  toggleTask: (id: number) => void;
  onAdd: () => void;
  onWhy: () => void;
  onRecords: () => void;
}) {
  return (
    <div className="home-view" data-home-profile={profile}>
      <section className="welcome-row">
        <div>
          <span className="date-label">2026년 7월 13일 월요일</span>
          <h1>{content.greeting}</h1>
          <p>{content.intro}</p>
        </div>
        <button className="primary-button desktop-add" onClick={onAdd}><Plus /> 기록 추가</button>
      </section>

      <div className="dashboard-grid">
        <div className="primary-column">
          <section className="brief-card">
            <div className="brief-copy">
              <span className="eyebrow light">오늘의 브리핑</span>
              <h2>{content.briefTitle}</h2>
              <p>{content.briefNote}</p>
            </div>
            <div className="brief-stats" aria-label="오늘 요약">
              <div><strong>{tasks.length - completedCount}</strong><span>남은 할 일</span></div>
              <div><strong>{content.schedules.length}</strong><span>오늘 일정</span></div>
              <div><strong>1</strong><span>확인 요청</span></div>
            </div>
            <div className="brief-mascot"><LifeMascot /></div>
          </section>

          <section className="panel task-panel">
            <div className="panel-heading">
              <div><span className="eyebrow">오늘 가장 중요한 일</span><h2>오늘 할 일</h2></div>
              <span className="count-label">{completedCount}/{tasks.length} 완료</span>
            </div>
            <div className="progress-track"><span style={{ width: `${(completedCount / tasks.length) * 100}%` }} /></div>
            <div className="task-list">
              {tasks.map((task) => (
                <button key={task.id} className={`task-row ${task.done ? "done" : ""}`} onClick={() => toggleTask(task.id)}>
                  <span className="task-check">{task.done && <Check />}</span>
                  <span className={`task-kind-icon kind-${task.id}`}>{task.id === 1 ? <Footprints /> : task.id === 2 ? <Trophy /> : <Activity />}</span>
                  <span className="task-copy"><strong>{task.title}</strong><small>{task.source}</small></span>
                  <span className="task-time">{task.time}</span>
                </button>
              ))}
            </div>
            <button className="text-button" onClick={onAdd}><Plus /> 새 할 일 추가</button>
          </section>

          <section className="panel recent-panel">
            <div className="panel-heading compact">
              <div><span className="eyebrow">최근 기록</span><h2>이어서 확인하세요</h2></div>
              <button className="plain-link" onClick={onRecords}>전체 보기 <ChevronRight /></button>
            </div>
            <button className="recent-record" onClick={onRecords}>
              <span className="record-icon"><FileAudio /></span>
              <span><strong>{content.recent.title}</strong><small>{content.recent.meta}</small></span>
              <span className="record-result"><CheckCircle2 /> {content.recent.result}</span>
              <ChevronRight />
            </button>
          </section>
        </div>

        <aside className="context-column">
          <section className="panel schedule-panel">
            <div className="panel-heading compact">
              <div><span className="eyebrow">다가오는 일정</span><h2>오늘 일정</h2></div>
              <CalendarDays />
            </div>
            <div className="schedule-date"><strong>13</strong><span>7월<br />월요일</span></div>
            <div className="schedule-list">
              {content.schedules.map((item) => (
                <div key={`${item.time}-${item.title}`}><span>{item.time}</span><strong><Footprints /> {item.title}</strong><small><MapPin /> {item.place}</small></div>
              ))}
            </div>
            <button className="secondary-button">캘린더에서 보기 <ChevronRight /></button>
          </section>

          <section className="insight-card">
            <div className="insight-top"><span><Sparkles /> AI가 발견한 내용</span><span className="ai-label">AI 해석</span></div>
            <h2>{content.insight.title}</h2>
            <p>{content.insight.body}</p>
            <button onClick={onWhy}>왜 이렇게 판단했나요?</button>
          </section>

          <section className="panel followup-panel">
            <div className="followup-icon"><Clock3 /></div>
            <div><span className="eyebrow">놓치고 있는 일</span><h3>{content.insight.followup}</h3><p>{content.tasks.find((task) => !task.done)?.source ?? "운동 모임 기록"}에서 확인했습니다.</p></div>
            <button><ChevronRight /></button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function RecordsView({ records, onUpload }: { records: RecordItem[]; onUpload: () => void }) {
  return (
    <section className="list-page">
      <div className="page-heading">
        <div><span className="eyebrow">모든 기록</span><h1>기록</h1><p>통화, 음성 메모와 직접 작성한 내용을 모아봅니다.</p></div>
        <button className="primary-button" onClick={onUpload}><Plus /> 기록 추가</button>
      </div>
      <div className="filter-row">
        <button className="active">전체</button><button>통화</button><button>음성</button><button>메모</button>
        <button className="filter-search"><Search /> 기록 검색</button>
      </div>
      <div className="record-table panel">
        {records.map((record, index) => (
          <button className="record-row" key={record.title}>
            <span className="record-icon">{index === 0 ? <UsersRound /> : index === 1 ? <FileAudio /> : <Mic />}</span>
            <span className="record-main"><strong>{record.title}</strong><small>{record.meta}</small></span>
            <span className="record-person"><UsersRound /> {record.person}</span>
            <span className={`status-pill ${record.tone}`}>{record.tone === "working" && <LoaderCircle />} {record.status}</span>
            <MoreHorizontal />
          </button>
        ))}
      </div>
    </section>
  );
}

function MemoriesView({ memoryItems }: { memoryItems: MemoryItem[] }) {
  return (
    <section className="list-page">
      <div className="page-heading">
        <div><span className="eyebrow">확인하고 쌓이는 정보</span><h1>기억</h1><p>AI가 마음대로 저장하지 않고, 확인된 내용과 추정을 구분합니다.</p></div>
        <button className="secondary-button"><Search /> 기억 검색</button>
      </div>
      <div className="memory-filters"><button className="active">전체</button><button>사람</button><button>결정</button><button>약속</button><button>성향</button></div>
      <div className="memory-list">
        {memoryItems.map((item) => (
          <article className="memory-card" key={item.title}>
            <div className={`memory-icon ${item.state === "AI 추정" ? "ai" : ""}`}>{item.state === "AI 추정" ? <Sparkles /> : item.type === "운동" || item.type === "일정" ? <Footprints /> : item.type === "선호" ? <Star /> : <CheckCircle2 />}</div>
            <div><span className="memory-type">{item.type}</span><h2>{item.title}</h2><p>출처: {item.source}</p></div>
            <span className={`memory-state ${item.state === "AI 추정" ? "ai" : ""}`}>{item.state}</span>
            <ChevronRight />
          </article>
        ))}
      </div>
    </section>
  );
}

function AiView({
  messages,
  input,
  prompts,
  setInput,
  onSend,
}: {
  messages: Array<{ role: string; text: string }>;
  input: string;
  prompts: string[];
  setInput: (value: string) => void;
  onSend: (text?: string) => void;
}) {
  return (
    <section className="ai-page">
      <div className="ai-header"><div className="ai-avatar"><Brain /></div><div><h1>Life OS</h1><p>내 기록을 바탕으로 답합니다.</p></div><span><LockKeyhole /> 내 기록만 사용</span></div>
      <div className="prompt-chips">
        {prompts.map((text) => (
          <button key={text} onClick={() => onSend(text)}>{text}</button>
        ))}
      </div>
      <div className="chat-stream">
        {messages.map((message, index) => (
          <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}>
            {message.role === "ai" && <span className="mini-ai"><Sparkles /></span>}
            <p>{message.text}</p>
          </div>
        ))}
      </div>
      <form className="chat-form" onSubmit={(event) => { event.preventDefault(); onSend(); }}>
        <button type="button" aria-label="첨부"><Plus /></button>
        <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="무엇이든 물어보세요..." />
        <button className="send-button" aria-label="보내기"><Send /></button>
      </form>
    </section>
  );
}

function UploadView({
  file,
  duration,
  title,
  setTitle,
  participants,
  setParticipants,
  joined,
  setJoined,
  privacyChecked,
  setPrivacyChecked,
  onFile,
  onBack,
  onSubmit,
}: {
  file: File | null;
  duration: number | null;
  title: string;
  setTitle: (value: string) => void;
  participants: string;
  setParticipants: (value: string) => void;
  joined: string;
  setJoined: (value: string) => void;
  privacyChecked: boolean;
  setPrivacyChecked: (value: boolean) => void;
  onFile: (event: ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <section className="upload-page">
      <button className="back-button" onClick={onBack}><ChevronLeft /> 돌아가기</button>
      <div className="upload-heading"><span className="eyebrow">첫 기록 흐름</span><h1>통화 녹음 가져오기</h1><p>파일을 올리면 중요한 내용, 약속과 다음 행동을 찾습니다.</p></div>
      <form className="upload-form" onSubmit={onSubmit}>
        <section className="upload-section panel">
          <div className="section-number">1</div>
          <div className="section-copy"><h2>통화 파일 선택</h2><p>휴대폰에 저장된 녹음이나 공유받은 음성 파일을 선택하세요.</p></div>
          <label className={`drop-zone ${file ? "selected" : ""}`}>
            <input type="file" accept=".mp3,.m4a,.wav,.mp4,audio/*" onChange={onFile} />
            {file ? <CheckCircle2 /> : <Upload />}
            <strong>{file ? file.name : "파일을 선택하세요"}</strong>
            <span>{file ? `${formatBytes(file.size)} · ${formatDuration(duration)}` : "mp3, m4a, wav, mp4 · 무료 테스트 최대 25MB"}</span>
            <em>{file ? "다른 파일 선택" : "파일 선택"}</em>
          </label>
        </section>

        <section className="upload-section panel">
          <div className="section-number">2</div>
          <div className="section-copy"><h2>기록 정보</h2><p>나중에 쉽게 찾을 수 있도록 필요한 정보만 확인합니다.</p></div>
          <div className="form-grid">
            <label className="field full"><span>제목 <small>선택 사항</small></span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 러닝 동호회 운영진 통화" /></label>
            <label className="field"><span>통화 참여자 수</span><select value={participants} onChange={(event) => setParticipants(event.target.value)}><option>2명</option><option>3명</option><option>4명 이상</option><option>잘 모르겠음</option></select></label>
            <label className="field"><span>본인이 참여했나요?</span><select value={joined} onChange={(event) => setJoined(event.target.value)}><option>예</option><option>아니오</option></select></label>
            <label className="field"><span>녹음 날짜</span><input type="date" defaultValue="2026-07-08" /></label>
            <label className="field"><span>분석 방식</span><select defaultValue="기본 분석"><option>기본 분석</option><option>깊은 분석 (시간이 더 걸림)</option></select></label>
          </div>
        </section>

        <section className="privacy-confirm panel">
          <div className="privacy-icon"><LockKeyhole /></div>
          <div><h2>개인정보를 확인해 주세요</h2><p>업로드한 통화에는 상대방의 개인정보가 포함될 수 있습니다. 해당 파일을 처리하고 분석할 권한이 있는지 확인해 주세요.</p>
            <label className="check-label"><input type="checkbox" checked={privacyChecked} onChange={(event) => setPrivacyChecked(event.target.checked)} /><span>{privacyChecked && <Check />}</span><strong>위 내용을 확인했습니다.</strong></label>
          </div>
        </section>
        <div className="form-actions"><button type="button" className="secondary-button" onClick={onBack}>취소</button><button className="primary-button" disabled={!file || !privacyChecked}><Sparkles /> 분석 시작</button></div>
      </form>
    </section>
  );
}

function ProcessingView({ progress, done, title, onHome, onRecords }: { progress: number; done: boolean; title: string; onHome: () => void; onRecords: () => void }) {
  const steps = [
    { label: "파일 업로드", done: progress >= 100 },
    { label: "음성을 글로 바꾸기", done: done },
    { label: "참여자 구분", done: false },
    { label: "중요한 약속 찾기", done: false },
  ];
  return (
    <section className="processing-page">
      <div className={`processing-orb ${done ? "done" : ""}`}>{done ? <Check /> : <LoaderCircle />}</div>
      <span className="eyebrow">{done ? "업로드 완료" : `업로드 중 ${progress}%`}</span>
      <h1>{done ? "참여자를 확인할 준비가 됐어요." : "통화를 준비하고 있습니다."}</h1>
      <p>{done ? "다음 단계에서 화자 이름과 본인을 확인합니다." : "업로드가 끝날 때까지 이 화면을 유지해 주세요."}</p>
      <div className="processing-card panel">
        <div className="processing-file"><FileAudio /><span><strong>{title}</strong><small>통화 녹음</small></span><strong>{progress}%</strong></div>
        <div className="upload-progress"><span style={{ width: `${progress}%` }} /></div>
        <div className="process-steps">
          {steps.map((step, index) => (
            <div className={`${step.done ? "done" : ""} ${!step.done && ((progress < 100 && index === 0) || (done && index === 2)) ? "current" : ""}`} key={step.label}>
              <span>{step.done ? <Check /> : index + 1}</span><strong>{step.label}</strong><small>{step.done ? "완료" : index === 0 && !done ? "진행 중" : index === 2 && done ? "확인 필요" : "대기"}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="processing-actions">
        <button className="secondary-button" onClick={onHome}>홈으로 돌아가기</button>
        {done && <button className="primary-button" onClick={onRecords}>기록에서 확인</button>}
      </div>
    </section>
  );
}
