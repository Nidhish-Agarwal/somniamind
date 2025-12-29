export default function OverlayLoader() {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-purple-400/40 border-t-purple-400 animate-spin" />
        <p className="text-xs text-purple-200">Opening…</p>
      </div>
    </div>
  );
}
