export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] text-[#8b7a8a] font-serif">
      <div className="w-[60px] h-[60px] border-4 border-gray-200 border-t-[#8b7a8a] rounded-full animate-spin mb-6"></div>
      <div className="text-xl text-gray-600 text-center">🎊 Loading Anniversary Celebrations</div>
      <div className="text-sm text-gray-500 mt-2 italic">Preparing your milestone journey...</div>
    </div>
  );
}
