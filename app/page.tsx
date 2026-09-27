// import { loadMindChampsData } from "@/actions/chunk-load/procress-load";
// import { Button } from "@/components/ui/button";

// export default function RootPage() {
//   return <Button onClick={loadMindChampsData}>click</Button>;
// }

import { ChatBot } from "@/modules/chat"

export default function RootPage() {
  return <ChatBot />
}
