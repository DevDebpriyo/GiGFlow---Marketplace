import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, DollarSign, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { Gig, User as UserType } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface GigCardProps {
  gig: Gig;
  index?: number;
}

const GigCard = ({ gig, index = 0 }: GigCardProps) => {
  const owner = typeof gig.ownerId === 'object' ? gig.ownerId as UserType : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link to={`/gigs/${gig._id}`}>
        <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:border-primary/30">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                {gig.title}
              </h3>
              <Badge 
                variant="outline" 
                className={gig.status === 'open' ? 'status-badge-open' : 'status-badge-assigned'}
              >
                {gig.status}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {gig.description}
            </p>
          </CardContent>

          <CardFooter className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <DollarSign className="h-4 w-4 text-primary" />
                ${gig.budget.toLocaleString()}
              </span>
              {owner && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {owner.name}
                </span>
              )}
            </div>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formatDistanceToNow(new Date(gig.createdAt), { addSuffix: true })}
            </span>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
};

export default GigCard;
