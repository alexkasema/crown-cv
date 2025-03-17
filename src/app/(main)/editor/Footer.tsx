import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full border-t px-3 py-5">
      <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="cursor-pointer">
            Previous step
          </Button>
          <Button className="cursor-pointer">Next step</Button>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" asChild>
            <Link href="/resumes">Close</Link>
          </Button>
          <p className={cn("text-muted-foreground opacity-0")}>Saving...</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
