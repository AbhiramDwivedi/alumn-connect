import Link from "next/link"
import { branding } from "@/lib/branding"
import { Logo } from "@/components/ui/logo"
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-mnit-light py-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo size="lg" />
            <p className="text-sm text-muted-foreground max-w-xs">
              Connecting MNIT alumni worldwide to foster professional growth, networking, and community building.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-mnit-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/#features"
                  className="text-sm text-muted-foreground hover:text-mnit-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="/#about"
                  className="text-sm text-muted-foreground hover:text-mnit-primary transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-muted-foreground hover:text-mnit-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-mnit-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-mnit-primary transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-sm text-muted-foreground hover:text-mnit-primary transition-colors"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Connect</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${branding.contact.email}`}
                  className="text-sm text-muted-foreground hover:text-mnit-primary transition-colors"
                >
                  {branding.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${branding.contact.phone}`}
                  className="text-sm text-muted-foreground hover:text-mnit-primary transition-colors"
                >
                  {branding.contact.phone}
                </a>
              </li>
              <li className="text-sm text-muted-foreground">{branding.contact.address}</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {branding.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href={branding.social.facebook}
              className="text-muted-foreground hover:text-mnit-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </a>
            <a
              href={branding.social.twitter}
              className="text-muted-foreground hover:text-mnit-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href={branding.social.linkedin}
              className="text-muted-foreground hover:text-mnit-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a
              href={branding.social.instagram}
              className="text-muted-foreground hover:text-mnit-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href={branding.social.youtube}
              className="text-muted-foreground hover:text-mnit-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Youtube size={20} />
              <span className="sr-only">YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
