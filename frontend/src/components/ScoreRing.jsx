export default function ScoreRing({ score = 0, label = 'Score' }) {
  const pct = Math.max(0, Math.min(100, Number(score) * 10));
  return (
    <div className="border-2 border-[#0A0A0A] bg-white p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">{label}</span>
        <span className="text-sm font-black text-[#0A0A0A]">{Number(score || 0).toFixed(1)}</span>
      </div>
      <div className="h-2 border border-[#0A0A0A] bg-[#F5F3EE]">
        <div className="h-full bg-[#0A0A0A]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
