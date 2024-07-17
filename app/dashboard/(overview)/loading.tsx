// Option-1
//export default function Loading() {
//    return <div>Loading...</div>;
//}

// Option-2 using skeleton
// Note: to be able to see the skeleton we need to slow down the data
// request in data.ts - fetchRevenue() by artifically set the sleep
// to let's say 3 secs
import DashboardSkeleton from '@/app/ui/skeletons';
 
export default function Loading() {
  return <DashboardSkeleton />;
}