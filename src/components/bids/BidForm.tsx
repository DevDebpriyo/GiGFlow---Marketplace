import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BidFormProps {
  onSubmit: (data: { message: string; price: number }) => void;
  isLoading: boolean;
  maxBudget: number;
}

const BidForm = ({ onSubmit, isLoading, maxBudget }: BidFormProps) => {
  const [message, setMessage] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && price) {
      onSubmit({
        message: message.trim(),
        price: parseFloat(price),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-xl">Submit Your Bid</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message">Proposal</Label>
              <Textarea
                id="message"
                placeholder="Explain why you're the best fit for this gig..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Your Bid Price</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="pl-9"
                  min="1"
                  max={maxBudget * 1.5}
                  step="0.01"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Client budget: ${maxBudget.toLocaleString()}
              </p>
            </div>

            <Button type="submit" className="w-full gap-2" disabled={isLoading}>
              <Send className="h-4 w-4" />
              {isLoading ? 'Submitting...' : 'Submit Bid'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BidForm;
