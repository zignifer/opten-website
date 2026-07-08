import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Play, X } from "lucide-react";
import { useLang } from "../../i18n/LangContext";

const EXTENSION_AVATAR_VIDEO_SOURCES = {
  ru: "/assets/extension-avatar/opten-extension-avatar.mp4",
  en: "/assets/extension-avatar/opten-extension-avatar-en.mp4",
} as const;

const EXTENSION_AVATAR_VIDEO_FORMATS = {
  ru: "portrait",
  en: "landscape",
} as const;

type AvatarMode = "idle" | "active";

export default function ExtensionVideoAvatar() {
  const { lang } = useLang();
  const [mode, setMode] = useState<AvatarMode>("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = EXTENSION_AVATAR_VIDEO_SOURCES[lang];
  const videoFormat = EXTENSION_AVATAR_VIDEO_FORMATS[lang];
  const isIdle = mode === "idle";
  const label = lang === "en"
    ? {
        region: "Opten video",
        play: "Play video with sound",
        replay: "Watch from the beginning",
        close: "Collapse video",
      }
    : {
        region: "Видео об Opten",
        play: "Включить видео со звуком",
        replay: "Посмотреть видео сначала",
        close: "Свернуть видео",
      };

  useEffect(() => {
    const video = videoRef.current;
    setMode("idle");
    if (!video) return;

    video.muted = true;
    video.currentTime = 0;
    video.load();
    video.play().catch(() => {});
  }, [videoSrc]);

  function playWithSound() {
    const video = videoRef.current;
    setMode("active");

    if (!video) return;

    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  function closeAvatar(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    const video = videoRef.current;
    setMode("idle");

    if (!video) return;

    video.muted = true;
    video.currentTime = 0;
    video.play().catch(() => {});
  }

  return (
    <aside
      className={isIdle ? "opten-extension-avatar" : "opten-extension-avatar opten-extension-avatar--active"}
      data-extension-video-avatar
      data-video-format={videoFormat}
      aria-label={label.region}
    >
      {!isIdle && (
        <button
          className="opten-extension-avatar__close"
          type="button"
          aria-label={label.close}
          onClick={closeAvatar}
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
      <button
        className="opten-extension-avatar__media"
        type="button"
        aria-label={isIdle ? label.play : label.replay}
        onClick={playWithSound}
      >
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted={isIdle}
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
        {isIdle && (
          <span className="opten-extension-avatar__play" aria-hidden="true">
            <Play size={20} fill="currentColor" strokeWidth={2.2} />
          </span>
        )}
      </button>
    </aside>
  );
}
