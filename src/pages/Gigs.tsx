import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import GigList from '@/components/gigs/GigList';
import SearchBar from '@/components/gigs/SearchBar';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchGigs, setSearchQuery } from '@/store/slices/gigsSlice';
import { useDebouncedCallback } from '@/hooks/useDebounce';

const Gigs = () => {
  const dispatch = useAppDispatch();
  const { gigs, isLoading, searchQuery } = useAppSelector((state) => state.gigs);

  useEffect(() => {
    dispatch(fetchGigs(searchQuery || undefined));
  }, [dispatch]);

  const debouncedSearch = useDebouncedCallback((value: string) => {
    dispatch(fetchGigs(value || undefined));
  }, 500);

  const handleSearchChange = useCallback((value: string) => {
    dispatch(setSearchQuery(value));
  }, [dispatch]);

  const handleSearch = useCallback((value: string) => {
    dispatch(fetchGigs(value || undefined));
  }, [dispatch]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl font-bold lg:text-4xl">Browse Gigs</h1>
          <p className="mt-2 text-muted-foreground">
            Find your next opportunity from our open gigs
          </p>
        </motion.div>

        <div className="mb-8">
          <SearchBar
            value={searchQuery}
            onChange={(value) => {
              handleSearchChange(value);
              debouncedSearch(value);
            }}
            onSearch={handleSearch}
          />
        </div>

        <GigList gigs={gigs} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default Gigs;
