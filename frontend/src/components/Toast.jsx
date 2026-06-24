export default function Toast({ message, type = 'info', onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 border-2 border-[#0A0A0A] bg-white p-4 max-w-sm">
      <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">{type}</p>
      <p className="text-sm font-bold text-[#0A0A0A]">{message}</p>
      {onClose && (
        <button type="button" onClick={onClose} className="mt-3 text-[10px] font-black uppercase tracking-widest underline">
          Close
        </button>
      )}
    </div>
  );
}
