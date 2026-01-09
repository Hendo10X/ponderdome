export function CTA() {
  return (
    <div className="w-full flex justify-center px-4 py-8">
      <div className="bg-white rounded-3xl p-12 w-full max-w-3xl flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-ponder-black tracking-tight font-sans mb-4">
          Ready to share your brain?
        </h2>
        <p className="text-ponder-charcoal text-base md:text-lg max-w-lg mb-8 leading-relaxed">
          Join thousands of others currently staring at their bathroom tiles. It's free, it's weird, and it's waiting for you.
        </p>
        <div className="flex flex-row gap-3 w-full justify-center">
          <button className="bg-ponder-blue text-white text-sm md:text-base font-semibold px-5 py-3 md:px-8 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
            Yes, why not?
          </button>
          <button className="bg-[#E5E5E5] text-ponder-charcoal text-sm md:text-base font-semibold px-5 py-3 md:px-8 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap">
            Request for something
          </button>
        </div>
      </div>
    </div>
  );
}
