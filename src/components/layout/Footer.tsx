import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const footerLinks = {
  services: [
    { label: "Web Development", href: "/services" },
    { label: "Software Development", href: "/services" },
    { label: "Mobile Apps", href: "/services" },
    { label: "UI/UX Design", href: "/services" },
    { label: "Graphic Design", href: "/services" },
    { label: "Email Setup", href: "/services" },
  ],
  products: [
    { label: "JL POS System", href: "/products" },
    { label: "School Management", href: "/products" },
    { label: "Custom Systems", href: "/products" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Contact", href: "/contact" },
  ],
};

export const Footer = () => {
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-background border-t border-cyan-500/20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <img src={logo} alt="JL Software" className="h-12 w-auto object-contain transition-transform group-hover:scale-105" />
            </Link>
            <p className="text-foreground font-semibold text-sm mb-2">
              {settings.company_name} (JavaLab)
            </p>
            <p className="text-muted-foreground text-sm mb-6 max-w-sm">
              Web Design, Software Development & Digital Systems. Building modern digital solutions that help businesses operate smarter.
            </p>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              <a href={`mailto:${settings.contact_email}`} className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Mail size={16} className="text-cyan-500" />
                {settings.contact_email}
              </a>
              <a href={`tel:${settings.contact_phone.replace(/\s/g, '')}`} className="flex items-center gap-2 hover:text-cyan-400 transition-colors">
                <Phone size={16} className="text-cyan-500" />
                {settings.contact_phone}
              </a>
              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-cyan-500" />
                {settings.contact_address}
              </span>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-cyan-500 rounded-full"></span>
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-cyan-500 rounded-full"></span>
              Products
            </h4>
            <ul className="space-y-3">
              {footerLinks.products.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <span className="w-1 h-4 bg-cyan-500 rounded-full"></span>
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-cyan-500/20 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {settings.company_name} (JavaLab). All Rights Reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-cyan-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-cyan-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
