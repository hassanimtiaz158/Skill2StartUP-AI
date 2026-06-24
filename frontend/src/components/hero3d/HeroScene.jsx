export default function HeroScene() {
  return (
    <div className="border-2 border-[#0A0A0A] bg-white p-6">
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 16 }).map((_, index) => (
          <div key={index} className={`aspect-square border-2 border-[#0A0A0A] ${index % 3 === 0 ? 'bg-[#0A0A0A]' : 'bg-[#F5F3EE]'}`} />
        ))}
      </div>
    </div>
  );
}
