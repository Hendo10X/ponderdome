import { Bird, Check, Star } from "lucide-react";

export function HowItWorks() {
  return (
    <div className="w-full flex flex-col items-center">
      <div className="text-center mb-12 space-y-3 max-w-2xl px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
          Here’s how it works
        </h2>
        <p className="text-lg text-muted-foreground">
          Like... why should you even use this thing? Lemme explain real quick.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-sm md:max-w-5xl">
        <div className="bg-card rounded-xl p-6 flex flex-col items-center text-center">
          <div className="mb-4 bg-yellow-50 p-3 rounded-full">
            <Bird className="w-8 h-8 text-[#FFCC00] fill-current" strokeWidth={1.5} />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Lather. Rinse. Realize.
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Drop your most profound, weird, or "wait, what?" thoughts into the Dome.
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 flex flex-col items-center text-center">
          <div className="mb-4 bg-green-50 p-3 rounded-full">
            <Check className="w-8 h-8 text-[#00D74C]" strokeWidth={4} />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Survive the Scrub.
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Every vote helps the best logic rise to the top.
          </p>
        </div>

        <div className="bg-card rounded-xl p-6 flex flex-col items-center text-center">
          <div className="mb-4 bg-purple-50 p-3 rounded-full">
            <Star className="w-8 h-8 text-[#9369FF] fill-current" strokeWidth={0} />
          </div>
          <h3 className="text-lg font-bold text-foreground mb-2">
            Ascend the Leaderboard.
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            The top thoughts are etched into the Ponderdome Hall of Fame forever.
          </p>
        </div>
      </div>
    </div>
  );
}
