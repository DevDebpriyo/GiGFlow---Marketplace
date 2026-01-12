import { motion } from 'framer-motion';
import { DollarSign, User, Clock, CheckCircle, XCircle, Clock3 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import type { Bid, User as UserType } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface BidCardProps {
  bid: Bid;
  isOwner: boolean;
  gigStatus: 'open' | 'assigned';
  onHire?: (bidId: string) => void;
  isHiring?: boolean;
  index?: number;
}

const statusIcons = {
  pending: Clock3,
  hired: CheckCircle,
  rejected: XCircle,
};

const BidCard = ({ bid, isOwner, gigStatus, onHire, isHiring, index = 0 }: BidCardProps) => {
  const freelancer = typeof bid.freelancerId === 'object' ? bid.freelancerId as UserType : null;
  const StatusIcon = statusIcons[bid.status];

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                <User className="h-5 w-5 text-secondary-foreground" />
              </div>
              <div>
                <h4 className="font-medium">
                  {freelancer?.name || 'Anonymous'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {freelancer?.email}
                </p>
              </div>
            </div>
            <Badge 
              variant="outline" 
              className={`status-badge-${bid.status} flex items-center gap-1`}
            >
              <StatusIcon className="h-3 w-3" />
              {bid.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground">{bid.message}</p>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1.5 font-semibold text-foreground">
              <DollarSign className="h-4 w-4 text-primary" />
              ${bid.price.toLocaleString()}
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              {formatDistanceToNow(new Date(bid.createdAt), { addSuffix: true })}
            </span>
          </div>

          {isOwner && gigStatus === 'open' && bid.status === 'pending' && (
            <Button
              size="sm"
              onClick={() => onHire?.(bid._id)}
              disabled={isHiring}
            >
              {isHiring ? 'Hiring...' : 'Hire'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BidCard;
