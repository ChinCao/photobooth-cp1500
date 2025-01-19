import LiveCamera from "@/components/LiveCamera";
import {Card} from "@/components/ui/card";

const CapturePage = () => {
  const snapShotCount = 6;
  return (
    <Card className="bg-background w-[90%] min-h-[90vh] mb-8 flex items-center justify-start p-8 flex-col gap-9">
      <LiveCamera />
    </Card>
  );
};

export default CapturePage;
