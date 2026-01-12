import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import GigList from '@/components/gigs/GigList';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGigs } from '@/store/slices/gigsSlice';

const MyGigs = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { gigs, isLoading } = useAppSelector((state) => state.gigs);
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    dispatch(fetchGigs(undefined));
  }, [isAuthenticated, navigate, dispatch]);

  // Filter gigs owned by current user
  const myGigs = gigs.filter((gig) => {
    const ownerId = typeof gig.ownerId === 'object' ? gig.ownerId._id : gig.ownerId;
    return ownerId === user?._id;
  });

  const openGigs = myGigs.filter((g) => g.status === 'open');
  const assignedGigs = myGigs.filter((g) => g.status === 'assigned');

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-start justify-between"
        >
          <div>
            <h1 className="font-display text-3xl font-bold lg:text-4xl">My Gigs</h1>
            <p className="mt-2 text-muted-foreground">
              Manage your posted gigs and track their progress
            </p>
          </div>
          <Link to="/gigs/create">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Post New Gig
            </Button>
          </Link>
        </motion.div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({myGigs.length})</TabsTrigger>
            <TabsTrigger value="open">Open ({openGigs.length})</TabsTrigger>
            <TabsTrigger value="assigned">Assigned ({assignedGigs.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <GigList gigs={myGigs} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="open">
            <GigList gigs={openGigs} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="assigned">
            <GigList gigs={assignedGigs} isLoading={isLoading} />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyGigs;
