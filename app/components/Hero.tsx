import Image from "next/image";
import Link from "next/link";
export function Hero() {
  return (
    <div className="flex flex-col items-center text-center max-w-3xl mx-auto gap-2">
      <div className="mb-4">
        <Image 
          src="/Logo2.svg" 
          alt="Ponderdome Logo" 
          width={64} 
          height={64}
          className="w-12 h-12 md:w-16 md:h-16"
          priority
        />
      </div>

      <div className="space-y-4 max-w-xl mx-auto">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-foreground">
          The arena for your deepest distractions.
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed px-4">
          Ponderdome is the home for the world's best shower thoughts. Post your 3am epiphanies,vote on the weirdest logic,and climb the leaderboard.
        </p>
      </div>

      <div className="flex flex-col items-center gap-8 mt-6 w-full">
        <Link href="/sign-up">
        <button className="bg-primary text-primary-foreground text-base font-semibold px-6 py-2.5 rounded-full hover:opacity-90 transition-all cursor-pointer">
          Get started now
        </button>
        </Link>
        
        <div className="w-full max-w-2xl flex justify-center mb-8">
           <Image
             src="/Group 60.svg"
             alt="Ponderdome Card Preview"
             width={800}
             height={533} 
             className="w-full h-auto"
             priority
           />
        </div>
      </div>
    </div>
  );
}
