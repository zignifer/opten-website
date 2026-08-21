import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Play, X } from "lucide-react";
import { useLang } from "../../i18n/LangContext";

const EXTENSION_AVATAR_VIDEO_SOURCES = {
  ru: "/assets/extension-avatar/opten-extension-avatar.mp4",
  en: "/assets/extension-avatar/opten-extension-avatar-en.mp4",
} as const;

const EXTENSION_AVATAR_PREVIEW_SOURCES = {
  ru: "/assets/extension-avatar/opten-extension-avatar-preview.mp4",
  en: "/assets/extension-avatar/opten-extension-avatar-en-preview.mp4",
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
  const fullVideoSrc = EXTENSION_AVATAR_VIDEO_SOURCES[lang];
  const previewVideoSrc = EXTENSION_AVATAR_PREVIEW_SOURCES[lang];
  const videoFormat = EXTENSION_AVATAR_VIDEO_FORMATS[lang];
  const isIdle = mode === "idle";
  const activeVideoSrc = isIdle ? previewVideoSrc : fullVideoSrc;
  const label = lang === "en"
    ? {
        region: "Opten video",
        play: "Play video with sound",
        close: "Collapse video",
      }
    : {
        region: "Видео об Opten",
        play: "Включить видео со звуком",
        close: "Свернуть видео",
      };

  useEffect(() => {
    setMode("idle");
  }, [lang]);

  useEffect(() => {
    if (mode !== "active") return;

    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }, [mode, fullVideoSrc]);

  function toggleAvatar() {
    if (isIdle) {
      setMode("active");
      return;
    }

    setMode("idle");
  }

  function closeAvatar(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setMode("idle");
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
        aria-label={isIdle ? label.play : label.close}
        onClick={toggleAvatar}
      >
        <video
          key={activeVideoSrc}
          ref={videoRef}
          src={activeVideoSrc}
          autoPlay={isIdle}
          muted={isIdle}
          loop
          playsInline
          preload={isIdle ? "auto" : "metadata"}
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
