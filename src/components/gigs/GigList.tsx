import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import GigCard from './GigCard';
import { Skeleton } from '@/components/ui/skeleton';
import type { Gig } from '@/types';

interface GigListProps {
  gigs: Gig[];
  isLoading: boolean;
}

const GigList = ({ gigs, isLoading }: GigListProps) => {
  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (gigs.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Briefcase className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold">No gigs found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or check back later for new opportunities.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {gigs.map((gig, index) => (
        <GigCard key={gig._id} gig={gig} index={index} />
      ))}
    </div>
  );
};

export default GigList;
