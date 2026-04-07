function Frame1() {
  return (
    <div className="content-stretch flex flex-col font-['PT_Root_UI:Regular',sans-serif] gap-[16px] items-center not-italic relative shrink-0 text-[18px] text-[rgba(255,255,255,0.6)] text-center whitespace-nowrap">
      <p className="leading-[0] relative shrink-0">
        <span className="leading-[1.6]">{`Работает с `}</span>
        <span className="font-['PT_Root_UI:Medium',sans-serif] leading-[1.6] text-white">43+ моделями</span>
        <span className="leading-[1.6]">{` генерации`}</span>
      </p>
      <p className="leading-[1.6] relative shrink-0">Midjourney · DALL·E · Stable Diffusion ·Flux · Kling · Seedance · GPT Image · Runway · Sora · Leonardo AI · Ideogram — и другие.</p>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-black content-stretch flex flex-col items-center justify-center pb-[56px] px-[120px] relative size-full">
      <Frame1 />
    </div>
  );
}