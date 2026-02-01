-- Create enum types
CREATE TYPE public.product_condition AS ENUM ('new', 'like_new', 'good', 'fair', 'poor');
CREATE TYPE public.listing_status AS ENUM ('active', 'sold', 'inactive', 'pending');
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.ticket_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    college_name TEXT DEFAULT 'Chandigarh University',
    is_premium BOOLEAN DEFAULT false,
    premium_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- User roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- Categories table
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Products/Listings table
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id),
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    condition product_condition DEFAULT 'good',
    images TEXT[] DEFAULT '{}',
    status listing_status DEFAULT 'active',
    is_featured BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Cart items table
CREATE TABLE public.cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Orders table
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id),
    amount DECIMAL(10, 2) NOT NULL,
    status order_status DEFAULT 'pending',
    payment_id TEXT,
    payment_method TEXT,
    shipping_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Premium plans table
CREATE TABLE public.premium_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL,
    features TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Help desk tickets table
CREATE TABLE public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status ticket_status DEFAULT 'open',
    priority TEXT DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Ticket messages table
CREATE TABLE public.ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES public.support_tickets(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    message TEXT NOT NULL,
    is_staff BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Wishlist table
CREATE TABLE public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, product_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.premium_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Categories policies (public read)
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage categories" ON public.categories FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Products policies
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (status = 'active' OR seller_id = auth.uid());
CREATE POLICY "Users can create products" ON public.products FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Users can update own products" ON public.products FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Users can delete own products" ON public.products FOR DELETE USING (auth.uid() = seller_id);

-- Cart items policies
CREATE POLICY "Users can view own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can remove from cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Sellers can update orders" ON public.orders FOR UPDATE USING (auth.uid() = seller_id);

-- Premium plans policies (public read)
CREATE POLICY "Premium plans are viewable by everyone" ON public.premium_plans FOR SELECT USING (is_active = true);

-- Support tickets policies
CREATE POLICY "Users can view own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can create tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tickets" ON public.support_tickets FOR UPDATE USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Ticket messages policies
CREATE POLICY "Users can view ticket messages" ON public.ticket_messages FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.support_tickets WHERE id = ticket_id AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin')))
);
CREATE POLICY "Users can send ticket messages" ON public.ticket_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Wishlist policies
CREATE POLICY "Users can view own wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (user_id, full_name)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default categories
INSERT INTO public.categories (name, icon) VALUES
    ('Electronics', 'Laptop'),
    ('Books', 'BookOpen'),
    ('Clothing', 'Shirt'),
    ('Furniture', 'Sofa'),
    ('Sports', 'Dumbbell'),
    ('Vehicles', 'Car'),
    ('Stationery', 'Pencil'),
    ('Others', 'Package');

-- Insert default premium plans
INSERT INTO public.premium_plans (name, price, duration_days, features) VALUES
    ('Basic', 99, 30, ARRAY['Featured listings', '5 boost per month', 'Priority support']),
    ('Pro', 249, 30, ARRAY['Unlimited featured listings', '15 boosts per month', 'Priority support', 'Verified badge']),
    ('Elite', 499, 30, ARRAY['All Pro features', 'Unlimited boosts', 'Dedicated support', 'Verified badge', 'Analytics dashboard']);

-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Storage policies
CREATE POLICY "Anyone can view product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);