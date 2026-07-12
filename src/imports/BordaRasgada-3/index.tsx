import svgPaths from "./svg-zt3gkeo3qa";

function Group() {
  return (
    <div className="absolute h-[37px] left-0 top-[17px] w-[1438px]" data-name="Group">
      <div className="absolute inset-[0_-0.28%_-21.62%_-0.28%]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1446 45">
          <g id="Group">
            <g filter="url(#filter0_d_21_201)" id="Vector">
              <path d={svgPaths.p1ca53f0} fill="var(--fill-0, white)" />
            </g>
          </g>
          <defs>
            <filter colorInterpolationFilters="sRGB" filterUnits="userSpaceOnUse" height="45" id="filter0_d_21_201" width="1446" x="0" y="1.22647e-08">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" result="hardAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend in2="BackgroundImageFix" mode="normal" result="effect1_dropShadow_21_201" />
              <feBlend in="SourceGraphic" in2="effect1_dropShadow_21_201" mode="normal" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute h-[45px] left-0 top-[3px] w-[1438px]" data-name="Group">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1438 45">
        <g id="Group">
          <path d={svgPaths.pc395300} fill="var(--fill-0, #C13333)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute contents left-0 top-[3px]">
      <Group2 />
    </div>
  );
}

export default function BordaRasgada() {
  return (
    <div className="drop-shadow-[0px_4px_2px_rgba(0,0,0,0.25)] relative size-full" data-name="borda rasgada">
      <Group />
      <Group1 />
    </div>
  );
}