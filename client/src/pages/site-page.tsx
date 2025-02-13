import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Site } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useEffect } from "react";

export default function SitePage() {
  const [, params] = useRoute("/sites/:slug");
  const { data: site, isLoading } = useQuery<Site>({
    queryKey: [`/api/sites/${params?.slug}`],
  });

  // Add Font Awesome CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!site) {
    return <div>Site not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="py-12"
        style={{ backgroundColor: site.themeColor || '#3b82f6' }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          {site.logoUrl && (
            <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full p-4">
              <AspectRatio ratio={1}>
                <img
                  src={site.logoUrl}
                  alt={site.businessName}
                  className="object-contain"
                />
              </AspectRatio>
            </div>
          )}
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {site.businessName}
          </h1>
          <p className="text-lg opacity-90">{site.description}</p>

          {/* Social Media Links */}
          {site.socialLinks && site.socialLinks.length > 0 && (
            <div className="flex justify-center gap-4 mt-6">
              {site.socialLinks.map((link, index) => {
                const icon = link.includes('facebook.com') ? 'fab fa-facebook' :
                           link.includes('twitter.com') ? 'fab fa-twitter' :
                           link.includes('instagram.com') ? 'fab fa-instagram' :
                           link.includes('linkedin.com') ? 'fab fa-linkedin' :
                           'fas fa-link';
                return (
                  <a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:opacity-80 transition-opacity"
                  >
                    <i className={`${icon} text-2xl`} />
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Contact Info */}
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-muted-foreground">{site.contactInfo}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Image Gallery */}
      {site.images && site.images.length > 0 && (
        <div className="py-12 bg-muted">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-2xl font-semibold mb-8 text-center">Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {site.images.map((imageUrl, index) => (
                <Card key={index}>
                  <CardContent className="p-2">
                    <AspectRatio ratio={4/3}>
                      <img
                        src={imageUrl}
                        alt={`Gallery image ${index + 1}`}
                        className="object-cover rounded-md"
                      />
                    </AspectRatio>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}