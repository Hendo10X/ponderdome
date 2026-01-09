export function CTA() {
  return (
    <div className="w-full flex justify-center px-4 py-8">
      <div className="bg-white rounded-3xl p-6 md:p-12 w-full max-w-3xl flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-ponder-black tracking-tight font-sans mb-4">
          Ready to share your brain?
        </h2>
        <p className="text-ponder-charcoal text-base md:text-lg max-w-lg mb-8 leading-relaxed">
          Join thousands of others currently staring at their bathroom tiles. It's free, it's weird, and it's waiting for you.
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full justify-center items-center">
          <button className="bg-ponder-blue text-white text-base md:text-lg font-semibold px-8 py-3.5 w-full md:w-auto rounded-full hover:opacity-90 transition-opacity">
            Yes, why not?
          </button>
          <button className="bg-[#E5E5E5] text-ponder-charcoal text-base md:text-lg font-semibold px-8 py-3.5 w-full md:w-auto rounded-full hover:opacity-90 transition-opacity">
            Request for something
          </button>
        </div>
      </div>
    </div>
  );
}
