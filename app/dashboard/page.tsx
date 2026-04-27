import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/document/DocumentCard";
import { EmptyState } from "@/components/shared/EmptyState";
import type { Database } from "@/types/supabase";

type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">My Documents</h1>
        <Link href="/create">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            Create Document
          </Button>
        </Link>
      </div>

      {documents && documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => (
            <DocumentCard
              key={doc.id}
              document={{
                id: doc.id,
                userId: doc.user_id,
                title: doc.title,
                track: doc.track as "freelancer" | "startup" | "creator",
                docType: doc.doc_type as any,
                jurisdiction: doc.jurisdiction as "NG" | "KE" | "GH" | "ZA",
                answers: doc.answers as Record<string, string | string[]>,
                content: doc.content ?? undefined,
                pdfUrl: doc.pdf_url ?? undefined,
                signedAt: doc.signed_at ?? undefined,
                signature: doc.signature ?? undefined,
                status: doc.status as "draft" | "generated" | "signed",
                createdAt: doc.created_at,
                updatedAt: doc.updated_at,
              }}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}