import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, DollarSign, User, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '@/components/layout/Layout';
import BidCard from '@/components/bids/BidCard';
import BidForm from '@/components/bids/BidForm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGigById, clearCurrentGig } from '@/store/slices/gigsSlice';
import { fetchBidsByGig, createBid, hireBid } from '@/store/slices/bidsSlice';
import { toast } from 'sonner';
import type { User as UserType } from '@/types';

const GigDetails = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  
  const { currentGig, isLoading: gigLoading } = useAppSelector((state) => state.gigs);
  const { bids, isLoading: bidsLoading } = useAppSelector((state) => state.bids);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const gigBids = id ? bids[id] || [] : [];
  const owner = currentGig && typeof currentGig.ownerId === 'object' 
    ? currentGig.ownerId as UserType 
    : null;
  const isOwner = user && owner && user._id === owner._id;
  const hasUserBid = gigBids.some(
    (bid) => typeof bid.freelancerId === 'object' && (bid.freelancerId as UserType)._id === user?._id
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchGigById(id));
      dispatch(fetchBidsByGig(id));
    }
    return () => {
      dispatch(clearCurrentGig());
    };
  }, [id, dispatch]);

  const handleSubmitBid = async (data: { message: string; price: number }) => {
    if (!id) return;
    try {
      await dispatch(createBid({ gigId: id, ...data })).unwrap();
      toast.success('Bid submitted successfully!');
    } catch (error: any) {
      toast.error(error || 'Failed to submit bid');
    }
  };

  const handleHire = async (bidId: string) => {
    if (!id) return;
    try {
      await dispatch(hireBid({ bidId, gigId: id })).unwrap();
      toast.success('Freelancer hired successfully!');
    } catch (error: any) {
      toast.error(error || 'Failed to hire');
    }
  };

  if (gigLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="mb-4 h-8 w-32" />
          <Skeleton className="mb-2 h-10 w-3/4" />
          <Skeleton className="mb-8 h-6 w-1/2" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </Layout>
    );
  }

  if (!currentGig) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="font-display text-2xl font-bold">Gig not found</h2>
          <p className="mt-2 text-muted-foreground">
            This gig may have been removed or doesn't exist.
          </p>
          <Link to="/gigs" className="mt-6 inline-block">
            <Button>Browse Gigs</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/gigs">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Gigs
            </Button>
          </Link>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="font-display text-2xl lg:text-3xl">
                      {currentGig.title}
                    </CardTitle>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {owner && (
                        <span className="flex items-center gap-1.5">
                          <User className="h-4 w-4" />
                          Posted by {owner.name}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(currentGig.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={currentGig.status === 'open' ? 'status-badge-open' : 'status-badge-assigned'}
                  >
                    {currentGig.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-6 flex items-center gap-2 rounded-lg bg-primary/10 p-4">
                  <DollarSign className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-display text-2xl font-bold text-primary">
                      ${currentGig.budget.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="mb-3 font-display text-lg font-semibold">Description</h3>
                  <p className="whitespace-pre-wrap text-muted-foreground">
                    {currentGig.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Bids Section */}
            {(isOwner || hasUserBid) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8"
              >
                <div className="mb-4 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-xl font-semibold">
                    Bids ({gigBids.length})
                  </h2>
                </div>

                {bidsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-[150px] w-full" />
                    ))}
                  </div>
                ) : gigBids.length > 0 ? (
                  <div className="space-y-4">
                    {gigBids.map((bid, index) => (
                      <BidCard
                        key={bid._id}
                        bid={bid}
                        isOwner={isOwner || false}
                        gigStatus={currentGig.status}
                        onHire={handleHire}
                        isHiring={bidsLoading}
                        index={index}
                      />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No bids yet</p>
                  </Card>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Bid Form */}
            {isAuthenticated && !isOwner && currentGig.status === 'open' && !hasUserBid && (
              <BidForm
                onSubmit={handleSubmitBid}
                isLoading={bidsLoading}
                maxBudget={currentGig.budget}
              />
            )}

            {/* Already bid message */}
            {hasUserBid && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p className="font-medium">You've already submitted a bid</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Wait for the client's response
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Owner's gig message */}
            {isOwner && (
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-6 text-center">
                  <User className="mx-auto mb-2 h-8 w-8 text-primary" />
                  <p className="font-medium">This is your gig</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review and hire from the bids below
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Not authenticated message */}
            {!isAuthenticated && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="mb-4 text-muted-foreground">
                    Sign in to submit a bid on this gig
                  </p>
                  <Link to="/login">
                    <Button className="w-full">Sign In to Bid</Button>
                  </Link>
                </CardContent>
              </Card>
            )}

            {/* Gig closed message */}
            {currentGig.status === 'assigned' && !isOwner && (
              <Card className="border-status-assigned/30 bg-status-assigned/5">
                <CardContent className="p-6 text-center">
                  <p className="font-medium text-status-assigned">Gig Assigned</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This gig has been assigned to a freelancer
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default GigDetails;
