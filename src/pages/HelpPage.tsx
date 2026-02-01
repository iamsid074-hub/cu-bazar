import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, Send, Loader2, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function HelpPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setTickets(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to create a ticket');
      navigate('/auth?redirect=/help');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('support_tickets').insert({
        user_id: user.id,
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority
      });

      if (error) throw error;
      toast.success('Support ticket created!');
      setFormData({ subject: '', description: '', priority: 'medium' });
      setShowForm(false);
      fetchTickets();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  const faqs = [
    {
      question: 'How do I list an item for sale?',
      answer: 'Simply click on "Sell" in the navigation, fill out the product details including title, description, price, and upload images. Your listing will be live immediately!'
    },
    {
      question: 'Is there a fee for selling?',
      answer: 'CU Bazar is completely free for basic listings. Premium plans offer additional features like featured listings and priority support.'
    },
    {
      question: 'How do payments work?',
      answer: 'We support all major payment methods through Razorpay including UPI, cards, and net banking. Payments are securely processed and transferred to sellers.'
    },
    {
      question: 'How can I contact a seller?',
      answer: 'Click on any product listing to see seller details. You can then contact them through the platform messaging system.'
    },
    {
      question: 'What if I have a dispute with a buyer/seller?',
      answer: 'Open a support ticket describing the issue. Our team will investigate and help resolve the dispute within 24-48 hours.'
    },
    {
      question: 'How do I become a premium member?',
      answer: 'Visit the Premium page from the navigation menu. Choose a plan that suits your needs and complete the payment to unlock premium features.'
    }
  ];

  const statusColors: Record<string, string> = {
    open: 'bg-cu-amber text-white',
    in_progress: 'bg-primary text-primary-foreground',
    resolved: 'bg-cu-success text-white',
    closed: 'bg-muted text-muted-foreground'
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-2xl cu-gradient flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Help Center</h1>
          <p className="text-muted-foreground">Find answers or get in touch with our support team</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="font-display text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border border-border/50 rounded-xl px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <span className="text-left font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Support Tickets */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Support Tickets</h2>
              <Button onClick={() => setShowForm(!showForm)} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Ticket
              </Button>
            </div>

            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleSubmit}
                className="mb-6 p-6 bg-card rounded-xl border border-border/50 space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Brief description of your issue"
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide more details about your issue..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Submit Ticket
                  </Button>
                </div>
              </motion.form>
            )}

            {user ? (
              tickets.length > 0 ? (
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="p-4 bg-card rounded-xl border border-border/50">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{ticket.subject}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{ticket.description}</p>
                        </div>
                        <Badge className={statusColors[ticket.status] || ''}>
                          {ticket.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/30 rounded-xl">
                  <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No support tickets yet.</p>
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-muted/30 rounded-xl">
                <p className="text-muted-foreground mb-4">Sign in to view and create support tickets.</p>
                <Button onClick={() => navigate('/auth?redirect=/help')}>Sign In</Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 text-center p-8 bg-card rounded-2xl border border-border/50"
        >
          <h2 className="font-display text-2xl font-bold mb-2">Still Need Help?</h2>
          <p className="text-muted-foreground mb-4">
            Our support team is available Monday to Saturday, 9 AM to 6 PM IST
          </p>
          <p className="text-primary font-medium">support@cubazar.in</p>
        </motion.div>
      </div>
    </div>
  );
}
