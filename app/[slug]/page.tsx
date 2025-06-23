

import { notFound } from "next/navigation"
import { outlines } from "@/lib/outline"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const dynamicParams = false // pre-render only the slugs we export

export function generateStaticParams() {
  return outlines.map(({ slug }) => ({ slug }))
}

type Props = { params: { slug: string } }

export default function Page({ params }: Props) {
  const outline = outlines.find((o) => o.slug === params.slug)
  if (!outline) notFound()

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <section className="mx-auto max-w-4xl">
        {/* ─── SEO heading ─────────────────────────────────────────────── */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            {outline.seoTitle}
          </h1>
          <p className="mt-2 text-muted-foreground">{outline.seoDescription}</p>
        </header>

        {/* ─── Keyword table ───────────────────────────────────────────── */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Keyword Analysis</CardTitle>
            <CardDescription>
              Target keywords and their search intent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Keyword</TableHead>
                    <TableHead>Intent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {outline.keywords.map((kw, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{kw.keyword}</TableCell>
                      <TableCell>
                        <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {kw.intent}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* ─── Blog outline ────────────────────────────────────────────── */}
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="bg-blue-200 text-blue-900 font-bold p-4 rounded-xl text-lg text-center">
                Blog Outline
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <article className="space-y-6">
              <h1 className="text-3xl font-bold">{outline.articleTitle}</h1>

              <h2 className="text-2xl font-bold">{outline.gapHeading}</h2>
              <p>{outline.gapBody}</p>

              <h2 className="text-2xl font-bold">{outline.fillGapHeading}</h2>
              <p>{outline.fillGapBody}</p>
            </article>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
