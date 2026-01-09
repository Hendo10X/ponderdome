import Image from "next/image";

export function AscendToEnlightenment() {
  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="text-center mb-12 space-y-3 max-w-2xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-ponder-black tracking-tight font-sans">
          Ascend to
          <br />
          Enlightenment
        </h2>
        <p className="text-lg text-ponder-charcoal">
          Become the best shower
          <br />
          thoughts master
        </p>
      </div>

      <div className="w-full max-w-4xl px-4 flex justify-center">
        <Image
          src="/Group 70.svg"
          alt="Ascend to Enlightenment - Leaderboard Preview"
          width={800}
          height={600}
          className="w-full h-auto max-w-2xl"
          priority
        />
      </div>
    </div>
  );
}
