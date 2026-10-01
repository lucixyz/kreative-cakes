// Drawn cake illustration used wherever the storefront needs a cake image (hero, product cards,
// customizer, gallery). Real photos / a 3D render replace this later; the props mirror the
// customizer options so one component serves every preview.
export type CakeArtProps = {
  tiers?: 1 | 2 | 3;
  color?: string;
  shape?: "round" | "square";
  drip?: boolean;
  sprinkles?: boolean;
  topper?: "none" | "candles" | "flowers" | "butterfly";
  message?: string;
  label?: string;
};

function mix(hex: string, to: string, t: number): string {
  const n = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const a = n(hex);
  const b = n(to);
  const out = a.map((v, i) => Math.round(v + ((b[i] ?? 0) - v) * t));
  return `#${out.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

const WIDTHS = [190, 142, 98];
const TIER_H = 62;
const DRIP_LEN = [18, 30, 14, 26, 20, 34, 16];
const SPRINKLE = ["#ffffff", "#f6c445", "#6fb7e9", "#e85d8a", "#8fd18f"];

export function CakeArt({ tiers = 2, color = "#f2a7bd", shape = "round", drip = true, sprinkles = false, topper = "none", message = "", label }: CakeArtProps) {
  const cx = 150;
  const ry = shape === "round" ? 14 : 0;
  const top = mix(color, "#ffffff", 0.35);
  const side = color;
  const shade = mix(color, "#000000", 0.12);
  const ink = mix(color, "#000000", 0.55);
  const layers = Array.from({ length: tiers }, (_, i) => {
    const w = WIDTHS[i] ?? 98;
    const bottom = 280 - i * TIER_H;
    return { w, bottom, topY: bottom - TIER_H, i };
  });
  const crown = layers[layers.length - 1]!;

  return (
    <svg viewBox="0 0 300 320" role="img" aria-label={label ?? `${tiers}-tier cake`} className="cake-art">
      <ellipse cx={cx} cy={296} rx={146} ry={14} fill="#00000020" />
      <ellipse cx={cx} cy={288} rx={146} ry={14} fill="#f4e9e6" />
      <ellipse cx={cx} cy={284} rx={146} ry={12} fill="#fffaf8" />

      {layers.map(({ w, bottom, topY, i }) => {
        const left = cx - w / 2;
        const drips = Math.floor((w - 20) / 22);
        return (
          <g key={i}>
            {shape === "round" ? <ellipse cx={cx} cy={bottom} rx={w / 2} ry={ry} fill={shade} /> : null}
            <rect x={left} y={topY} width={w} height={TIER_H} fill={side} />
            {shape === "round" ? <rect x={left} y={topY} width={w} height={TIER_H} fill="url(#sheen)" /> : null}
            {drip
              ? Array.from({ length: drips }, (_, d) => (
                  <rect key={d} x={left + 10 + d * ((w - 28) / Math.max(drips - 1, 1))} y={topY} width={12} height={DRIP_LEN[(d + i) % DRIP_LEN.length]!} rx={6} fill={top} />
                ))
              : null}
            {sprinkles
              ? Array.from({ length: 12 }, (_, d) => (
                  <circle key={d} cx={left + 8 + ((d * 37 + i * 11) % (w - 16))} cy={topY + 38 + ((d * 17) % 20)} r={2.4} fill={SPRINKLE[(d + i) % SPRINKLE.length]} />
                ))
              : null}
            {shape === "round" ? (
              <ellipse cx={cx} cy={topY} rx={w / 2} ry={ry} fill={top} />
            ) : (
              <polygon points={`${left},${topY} ${left + w},${topY} ${left + w - 14},${topY - 14} ${left + 14},${topY - 14}`} fill={top} />
            )}
          </g>
        );
      })}

      {message ? (
        <text x={cx} y={280 - TIER_H / 2 + 5} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={15} fill={ink}>
          {message.slice(0, 18)}
        </text>
      ) : null}

      <g transform={`translate(${cx} ${crown.topY - 4})`}>
        {topper === "candles"
          ? [-22, 0, 22].map((x) => (
              <g key={x}>
                <rect x={x - 4} y={-34} width={8} height={32} rx={3} fill="#ffffff" stroke="#e7d9d5" />
                <ellipse cx={x} cy={-40} rx={4} ry={7} fill="#f6b73c" />
              </g>
            ))
          : null}
        {topper === "flowers"
          ? [[-24, -6, "#e85d8a"], [0, -14, "#ffffff"], [24, -6, "#f6c445"]].map(([x, y, c]) => (
              <g key={String(x)} transform={`translate(${x} ${y})`}>
                {[0, 72, 144, 216, 288].map((r) => (
                  <ellipse key={r} cx={0} cy={-9} rx={5.5} ry={9} fill={String(c)} stroke="#00000015" transform={`rotate(${r})`} />
                ))}
                <circle r={4} fill="#f6c445" />
              </g>
            ))
          : null}
        {topper === "butterfly" ? (
          <g transform="translate(0 -22)">
            <ellipse cx={-14} cy={-6} rx={14} ry={10} fill="#b79df0" transform="rotate(-25 -14 -6)" />
            <ellipse cx={14} cy={-6} rx={14} ry={10} fill="#b79df0" transform="rotate(25 14 -6)" />
            <ellipse cx={-10} cy={8} rx={9} ry={7} fill="#e9a8d6" />
            <ellipse cx={10} cy={8} rx={9} ry={7} fill="#e9a8d6" />
            <rect x={-1.5} y={-10} width={3} height={22} rx={1.5} fill="#4a3a52" />
          </g>
        ) : null}
      </g>

      <defs>
        <linearGradient id="sheen" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.1" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0.14" />
        </linearGradient>
      </defs>
    </svg>
  );
}
