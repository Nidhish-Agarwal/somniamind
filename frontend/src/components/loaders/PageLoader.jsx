export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-400/30"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-indigo-400 animate-spin"></div>
        </div>

        <p className="text-sm tracking-wide text-indigo-200">
          Entering SomniaMind…
        </p>
      </div>
    </div>
  );
}
