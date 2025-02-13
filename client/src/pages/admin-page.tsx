import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Site } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminPage() {
  const { logoutMutation } = useAuth();
  const [search, setSearch] = useState("");

  const { data: sites, isLoading } = useQuery<Site[]>({
    queryKey: ["/api/sites"],
  });

  const filteredSites = sites?.filter((site) =>
    site.businessName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Total Sites: {sites?.length || 0}
            </p>
          </div>
          <Button variant="outline" onClick={() => logoutMutation.mutate()}>
            Log out
          </Button>
        </div>

        <div className="w-full max-w-sm">
          <Input
            placeholder="Search by business name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Site URL</TableHead>
                <TableHead>Gift Card Interest</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSites?.map((site) => (
                <TableRow key={site.id}>
                  <TableCell className="font-medium">{site.businessName}</TableCell>
                  <TableCell>{site.contactInfo}</TableCell>
                  <TableCell>
                    <a
                      href={`/sites/${site.slug}`}
                      className="text-primary hover:underline"
                    >
                      /sites/{site.slug}
                    </a>
                  </TableCell>
                  <TableCell>
                    {site.interestedInGiftCard ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    {new Date(site.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
