import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl cu-gradient flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">CU</span>
              </div>
              <span className="font-display font-bold text-xl">CU Bazar</span>
            </div>
            <p className="text-secondary-foreground/80 text-sm">
              Buy smart on campus, sell without stress, From hostel to home - CU Bazar does the rest.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link to="/browse" className="hover:text-primary transition-colors">Browse Products</Link></li>
              <li><Link to="/sell" className="hover:text-primary transition-colors">Sell Item</Link></li>
              <li><Link to="/premium" className="hover:text-primary transition-colors">Premium Plans</Link></li>
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-display font-semibold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/80">
              <li><Link to="/browse?category=electronics" className="hover:text-primary transition-colors">Electronics</Link></li>
              <li><Link to="/browse?category=books" className="hover:text-primary transition-colors">Books</Link></li>
              <li><Link to="/browse?category=clothing" className="hover:text-primary transition-colors">Clothing</Link></li>
              <li><Link to="/browse?category=furniture" className="hover:text-primary transition-colors">Furniture</Link></li>
              <li><Link to="/browse?category=sports" className="hover:text-primary transition-colors">Sports</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Chandigarh University, Mohali, Punjab</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>anshu123302@gmail.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+91 9466166750</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/20 mt-8 pt-8 text-center text-sm text-secondary-foreground/60">
          <p>© 2026 CU Bazzar. Created by <span className="text-primary font-semibold">ANSHU</span>. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
