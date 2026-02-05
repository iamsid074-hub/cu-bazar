 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { motion } from 'framer-motion';
 import { Upload, X, Loader2, Shield, MapPin, AlertTriangle } from 'lucide-react';
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
 
 export default function SellPage() {
   const { user } = useAuth();
   const navigate = useNavigate();
   const [loading, setLoading] = useState(false);
   const [categories, setCategories] = useState<any[]>([]);
   const [images, setImages] = useState<File[]>([]);
   const [previewUrls, setPreviewUrls] = useState<string[]>([]);
   const [isCUStudent, setIsCUStudent] = useState(false);
   
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
 
   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const files = Array.from(e.target.files || []);
     if (files.length + images.length > 3) {
       toast.error('Maximum 3 images allowed');
       return;
     }
     
     setImages(prev => [...prev, ...files]);
     
     files.forEach(file => {
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
 
     if (!formData.title || !formData.price || !formData.whatsapp_number) {
       toast.error('Please fill in Title, Price and WhatsApp number');
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
         title: formData.title,
         description: formData.description,
         price: parseFloat(formData.price),
         category_id: formData.category_id || null,
         location: formData.hostel_block || 'CU Campus',
         images: imageUrls,
         whatsapp_number: formData.whatsapp_number
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
               <Label>Photos (1-3 images)</Label>
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
             </div>
 
             {/* Title */}
             <div className="space-y-2">
               <Label htmlFor="title">Title *</Label>
               <Input
                 id="title"
                 placeholder="e.g. iPhone 13, Engineering Books, Study Table"
                 value={formData.title}
                 onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                 required
               />
             </div>
 
             {/* Price & WhatsApp */}
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="price">Price (₹) *</Label>
                 <Input
                   id="price"
                   type="number"
                   placeholder="0"
                   min="0"
                   value={formData.price}
                   onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                   required
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                 <Input
                   id="whatsapp"
                   type="tel"
                   placeholder="91XXXXXXXXXX"
                   value={formData.whatsapp_number}
                   onChange={(e) => setFormData(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                   required
                 />
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
 
             {/* Description - Optional */}
             <div className="space-y-2">
               <Label htmlFor="description">Description (Optional)</Label>
               <Textarea
                 id="description"
                 placeholder="Any extra details about your item..."
                 rows={3}
                 value={formData.description}
                 onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
               />
             </div>
 
             {/* Campus Deal Warning */}
             <div className="text-xs text-center text-muted-foreground bg-muted/30 p-3 rounded-lg">
               ⚠️ Only campus hand-to-hand deals. No online payments.
             </div>
 
             {/* Submit */}
             <Button type="submit" size="lg" className="w-full" disabled={loading}>
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