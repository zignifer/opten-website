import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Play, X } from "lucide-react";

const EXTENSION_AVATAR_VIDEO_SRC = "/assets/extension-avatar/opten-extension-avatar.mp4";

type AvatarMode = "idle" | "active";

export default function ExtensionVideoAvatar() {
  const [mode, setMode] = useState<AvatarMode>("idle");
  const videoRef = useRef<HTMLVideoElement>(null);
  const isIdle = mode === "idle";

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});
  }, []);

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
      aria-label="Видео об Opten"
    >
      {!isIdle && (
        <button
          className="opten-extension-avatar__close"
          type="button"
          aria-label="Свернуть видео"
          onClick={closeAvatar}
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
      <button
        className="opten-extension-avatar__media"
        type="button"
        aria-label={isIdle ? "Включить видео со звуком" : "Посмотреть видео сначала"}
        onClick={playWithSound}
      >
        <video
          ref={videoRef}
          src={EXTENSION_AVATAR_VIDEO_SRC}
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
