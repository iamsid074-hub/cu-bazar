import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Loader2, Shield, MapPin, AlertTriangle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { z } from 'zod';

// Validation schema
const productSchema = z.object({
  title: z.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .refine(val => /[a-zA-Z]{3,}/.test(val), 'Title must contain actual words'),
  description: z.string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .or(z.literal('')),
  price: z.string()
    .refine(val => !isNaN(Number(val)) && Number(val) >= 1, 'Price must be at least ₹1')
    .refine(val => Number(val) <= 500000, 'Price must be less than ₹5,00,000'),
  whatsapp_number: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .refine(val => /^\d{10,15}$/.test(val.replace(/\D/g, '')), 'Enter a valid phone number'),
  category_id: z.string().optional(),
  hostel_block: z.string().optional(),
});

// List of blocked/spam words
const blockedWords = ['test', 'asdf', 'qwerty', 'dalla', 'spam', 'xyz123'];

export default function SellPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isCUStudent, setIsCUStudent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    whatsapp_number: '',
    hostel_block: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/sell');
      return;
    }

    async function fetchCategories() {
      const { data } = await supabase.from('categories').select('*');
      if (data) setCategories(data);
    }
    fetchCategories();
  }, [user, navigate]);

  const validateField = (field: string, value: string) => {
    const newErrors = { ...errors };
    
    switch (field) {
      case 'title':
        if (value.length < 5) {
          newErrors.title = 'Title must be at least 5 characters';
        } else if (!/[a-zA-Z]{3,}/.test(value)) {
          newErrors.title = 'Title must contain actual product name';
        } else if (blockedWords.some(word => value.toLowerCase().includes(word))) {
          newErrors.title = 'Title contains inappropriate content';
        } else {
          delete newErrors.title;
        }
        break;
      case 'description':
        if (value && value.length > 0 && value.length < 20) {
          newErrors.description = 'Description must be at least 20 characters';
        } else if (blockedWords.some(word => value.toLowerCase().includes(word))) {
          newErrors.description = 'Description contains inappropriate content';
        } else {
          delete newErrors.description;
        }
        break;
      case 'price':
        const priceNum = Number(value);
        if (isNaN(priceNum) || priceNum < 1) {
          newErrors.price = 'Price must be at least ₹1';
        } else if (priceNum > 500000) {
          newErrors.price = 'Price seems too high. Max ₹5,00,000';
        } else {
          delete newErrors.price;
        }
        break;
      case 'whatsapp_number':
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length < 10) {
          newErrors.whatsapp_number = 'Enter a valid 10-digit number';
        } else {
          delete newErrors.whatsapp_number;
        }
        break;
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + images.length > 3) {
      toast.error('Maximum 3 images allowed');
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });
    
    setImages(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    // Validate all fields
    try {
      productSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error('Please fix the validation errors');
        return;
      }
    }

    // Check for at least one image
    if (images.length === 0) {
      toast.error('Please add at least one product image');
      return;
    }

    // Final spam check
    const titleLower = formData.title.toLowerCase();
    const descLower = formData.description.toLowerCase();
    if (blockedWords.some(word => titleLower.includes(word) || descLower.includes(word))) {
      toast.error('Your listing contains inappropriate content. Please revise.');
      return;
    }

    setLoading(true);
    try {
      const imageUrls: string[] = [];
      for (const image of images) {
        const fileName = `${user.id}/${Date.now()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, image);

        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrls.push(publicUrl);
      }

      const { error } = await supabase.from('products').insert([{
        seller_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        price: parseFloat(formData.price),
        category_id: formData.category_id || null,
        location: formData.hostel_block || 'CU Campus',
        images: imageUrls,
        whatsapp_number: formData.whatsapp_number.replace(/\D/g, '')
      }]);

      if (error) throw error;

      toast.success('Product listed successfully!');
      navigate('/profile');
    } catch (error: any) {
      console.error('Error creating product:', error);
      toast.error(error.message || 'Failed to list product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 md:pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">Sell Your Item</h1>
          <p className="text-muted-foreground mb-6">List your product and reach thousands of CU students</p>

          {/* Safety Disclaimer */}
          <Alert className="mb-6 border-primary/50 bg-primary/10">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-muted-foreground">
              <strong>Safety First:</strong> Meet in public campus areas only. CU Bazar is a listing platform, not a seller.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload - Max 3 */}
            <div className="space-y-2">
              <Label>Photos (1-3 images) *</Label>
              <div className="grid grid-cols-3 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {previewUrls.length < 3 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center gap-2 transition-colors">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              {images.length === 0 && (
                <p className="text-xs text-muted-foreground">Add at least 1 clear product photo</p>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="e.g. iPhone 13, Engineering Books, Study Table"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className={errors.title ? 'border-destructive' : ''}
                required
              />
              {errors.title && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.title}
                </p>
              )}
            </div>

            {/* Price & Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  min="1"
                  max="500000"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={errors.price ? 'border-destructive' : ''}
                  required
                />
                {errors.price && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.price}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit number"
                  value={formData.whatsapp_number}
                  onChange={(e) => handleInputChange('whatsapp_number', e.target.value)}
                  className={errors.whatsapp_number ? 'border-destructive' : ''}
                  required
                />
                {errors.whatsapp_number && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.whatsapp_number}
                  </p>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category_id}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trust Section */}
            <div className="p-4 rounded-xl bg-muted/50 border border-border space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4 text-primary" />
                Trust Badge (Optional)
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="cu-student"
                  checked={isCUStudent}
                  onCheckedChange={(checked) => setIsCUStudent(checked as boolean)}
                />
                <label
                  htmlFor="cu-student"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I am a CU Student 🎓
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="hostel" className="text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Hostel / Block (Optional)
                </Label>
                <Input
                  id="hostel"
                  placeholder="e.g. BH-1, GH-3, Block A"
                  value={formData.hostel_block}
                  onChange={(e) => setFormData(prev => ({ ...prev, hostel_block: e.target.value }))}
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional, min 20 chars)</Label>
              <Textarea
                id="description"
                placeholder="Describe your item - condition, age, reason for selling..."
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className={errors.description ? 'border-destructive' : ''}
              />
              {errors.description && (
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {formData.description.length}/2000 characters
              </p>
            </div>

            {/* Campus Deal Warning */}
            <div className="text-xs text-center text-muted-foreground bg-muted/30 p-3 rounded-lg">
              ⚠️ Only campus hand-to-hand deals. No online payments.
            </div>

            {/* Submit */}
            <Button type="submit" size="lg" className="w-full" disabled={loading || Object.keys(errors).length > 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Listing...
                </>
              ) : (
                'List on CU Bazar 🚀'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
