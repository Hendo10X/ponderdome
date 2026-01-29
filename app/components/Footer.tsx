import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full py-12 flex justify-center items-center text-center px-4">
      <p className="text-muted-foreground font-medium text-sm md:text-base">
        if you find any bugs, then dm @boihendo on{" "}
        <Link 
          href="https://twitter.com/boihendo" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[#6982FF] hover:underline"
        >
          x/twitter
        </Link>
      </p>
    </footer>
  );
}
