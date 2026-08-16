import { AlertTriangle, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getBotDeepLink } from "@/lib/download-url";

interface MovieSupportActionsProps {
  movieId: string;
}

export function MovieSupportActions({ movieId }: MovieSupportActionsProps) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
      <a href={getBotDeepLink("request")}>
        <Button variant="outline" className="w-full justify-start gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          Request Movie
        </Button>
      </a>
      <a href={getBotDeepLink(`report_${movieId}`)}>
        <Button variant="outline" className="w-full justify-start gap-2">
          <AlertTriangle className="h-4 w-4" />
          Report Broken Link
        </Button>
      </a>
    </div>
  );
}
