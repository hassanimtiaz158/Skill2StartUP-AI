export default function Skeleton({ lines = 3 }) {
  return (
    <div className="border-2 border-[#0A0A0A] bg-white p-4 space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="h-3 border border-[#0A0A0A] bg-[#E8E6E0]" />
      ))}
    </div>
  );
}
