import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MODULES, getNextLesson } from "@/components/course/courseData";
import ModuleSidebar from "@/components/course/ModuleSidebar";
import LessonView from "@/components/course/LessonView";
import ExitDialog from "@/components/course/ExitDialog";
import ProgressBar from "@/components/course/ProgressBar";
import CertificateDownload from "@/components/course/CertificateDownload";
import { createPageUrl } from "@/utils";
import { getCurrentUser } from "@/lib/auth";
import { listUserProgress, createUserProgress, updateUserProgress } from "@/api/entities";
import { Menu, X } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";
import { Button } from "@/components/ui/button";

export default function Course() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const initModule = urlParams.get("module") || "deepseek";

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModuleId, setActiveModuleId] = useState(initModule);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const [certOpen, setCertOpen] = useState(false);
  const [certModuleName, setCertModuleName] = useState("");

  const loadProgress = async () => {
    const user = await getCurrentUser();
    if (!user) { navigate("/"); return; }

    const records = await listUserProgress();
    const userRecord = records.find(r => r.created_by === user.email);
    if (userRecord) {
      setProgress(userRecord);
      if (!urlParams.get("module") && userRecord.current_module) {
        setActiveModuleId(userRecord.current_module);
        setActiveLessonIndex(userRecord.current_lesson || 0);
      }
    } else {
      const record = await createUserProgress({
        created_by: user.email,
        enrolled: true,
        completed_lessons: [],
        quiz_scores: {},
        current_module: initModule,
        current_lesson: 0,
      });
      setProgress(record);
    }
    setLoading(false);
  };

  const { touchHandlers } = usePullToRefresh(loadProgress);

  useEffect(() => {
    loadProgress();
  }, []);

  const completedLessons = progress?.completed_lessons || [];
  const activeModule = MODULES.find(m => m.id === activeModuleId);
  const activeLesson = activeModule?.lessons[activeLessonIndex];

  const saveProgress = async (updates) => {
    if (!progress?.id) return;
    const updated = await updateUserProgress(progress.id, updates);
    setProgress(updated);
  };

  const handleLessonComplete = async (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      await saveProgress({ completed_lessons: updated });
    }
  };

  const handleNext = async () => {
    let updatedCompleted = completedLessons;
    if (activeLesson && !completedLessons.includes(activeLesson.id)) {
      updatedCompleted = [...completedLessons, activeLesson.id];
      await saveProgress({
        completed_lessons: updatedCompleted,
        current_module: activeModuleId,
        current_lesson: activeLessonIndex,
      });
    }

    const currentMod = MODULES.find(m => m.id === activeModuleId);
    const isLastLessonInModule = currentMod && activeLessonIndex === currentMod.lessons.length - 1;
    const allModuleLessonsCompleted = currentMod && currentMod.lessons.every(l => updatedCompleted.includes(l.id));

    if (isLastLessonInModule && allModuleLessonsCompleted) {
      setCertModuleName(currentMod.name);
      setCertOpen(true);
    }

    const next = getNextLesson(activeModuleId, activeLessonIndex);
    if (next) {
      setActiveModuleId(next.moduleId);
      setActiveLessonIndex(next.lessonIndex);
      await saveProgress({ current_module: next.moduleId, current_lesson: next.lessonIndex });
      window.scrollTo(0, 0);
    } else {
      navigate(createPageUrl("Summary"));
    }
  };

  const handleSelectModule = (moduleId) => {
    setActiveModuleId(moduleId);
    setActiveLessonIndex(0);
    saveProgress({ current_module: moduleId, current_lesson: 0 });
    setSidebarOpen(false);
  };

  const handleSelectLesson = (idx) => {
    setActiveLessonIndex(idx);
    saveProgress({ current_module: activeModuleId, current_lesson: idx });
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  };

  const totalLessons = MODULES.reduce((s, m) => s + m.lessons.length, 0);
  const overallProgress = totalLessons > 0 ? Math.round((completedLessons.length / totalLessons) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex" {...touchHandlers}>
      <div className="hidden lg:block w-72 border-r border-slate-200 bg-white fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-slate-100">
          <button onClick={() => navigate(createPageUrl("Home"))} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div>
              <span className="font-extrabold text-slate-900 text-base leading-none">Leamind</span>
              <p className="text-[9px] text-slate-400 leading-none mt-0.5">Learn AI the Right Way</p>
            </div>
          </button>
        </div>
        <ModuleSidebar
          activeModuleId={activeModuleId}
          activeLessonIndex={activeLessonIndex}
          completedLessons={completedLessons}
          onSelectModule={handleSelectModule}
          onSelectLesson={handleSelectLesson}
        />
      </div>

      <Drawer open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <DrawerContent className="max-h-[85vh] p-0">
          <div className="p-4 border-b flex items-center justify-between">
            <span className="text-lg font-extrabold text-slate-800">Lea<span className="text-indigo-600">mind</span></span>
            <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-slate-500" /></button>
          </div>
          <div className="overflow-y-auto">
            <ModuleSidebar
              activeModuleId={activeModuleId}
              activeLessonIndex={activeLessonIndex}
              completedLessons={completedLessons}
              onSelectModule={handleSelectModule}
              onSelectLesson={handleSelectLesson}
            />
          </div>
        </DrawerContent>
      </Drawer>

      <div className="flex-1 lg:ml-72">
        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-20" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
          <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg">
                <Menu className="w-5 h-5 text-slate-600" />
              </button>
              <div className="flex items-center gap-2">
                {activeModule && (
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${activeModule.color} flex items-center justify-center text-base`}>
                    {activeModule.emoji}
                  </div>
                )}
                <span className="font-semibold text-sm text-slate-800 hidden sm:inline">{activeModule?.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
                <span>{overallProgress}%</span>
                <ProgressBar value={overallProgress} size="sm" className="w-20" />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setExitOpen(true)} className="text-xs text-slate-500 hover:text-red-500">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8 md:py-12">
          {activeLesson && (
            <LessonView
              key={activeLesson.id}
              lesson={activeLesson}
              lessonIndex={activeLessonIndex}
              totalLessons={activeModule.lessons.length}
              onNext={handleNext}
              onComplete={handleLessonComplete}
            />
          )}
        </div>
      </div>

      <ExitDialog
        open={exitOpen}
        onContinue={() => setExitOpen(false)}
        onFinish={() => navigate(createPageUrl("Home"))}
      />

      <CertificateDownload
        moduleName={certModuleName}
        open={certOpen}
        onClose={() => setCertOpen(false)}
        allLessonsCompleted={true}
      />
    </div>
  );
}
