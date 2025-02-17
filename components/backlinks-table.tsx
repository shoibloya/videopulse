"use client"

import { useEffect, useState } from "react"
import Papa from "papaparse"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card } from "@/components/ui/card"

interface BacklinkData {
  referringPageTitle: string
  referringPageURL: string
  linksTo: string
}

export function BacklinksTable() {
  const [data, setData] = useState<BacklinkData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5 // Increased to 8 rows per page

  useEffect(() => {
    Papa.parse("/backlinks.csv", {
      download: true,
      header: true,
      complete: (results) => {
        const expectedTitle = "referring page title"
        const expectedURL = "referring page url"
        const expectedLinksTo = "links to"

        let titleCol = expectedTitle
        let urlCol = expectedURL
        let linksCol = expectedLinksTo

        if (results.data?.length) {
          const firstRow = results.data[0] as Record<string, any>
          const keys = Object.keys(firstRow)

          const foundTitle = keys.find((k) => k.trim().toLowerCase() === expectedTitle)
          if (foundTitle) titleCol = foundTitle

          const foundURL = keys.find((k) => k.trim().toLowerCase() === expectedURL)
          if (foundURL) urlCol = foundURL

          const foundLinks = keys.find((k) => k.trim().toLowerCase() === expectedLinksTo)
          if (foundLinks) linksCol = foundLinks
        }

        const filteredRows = results.data
          .filter((row: any) => row[titleCol] && row[urlCol] && row[linksCol])
          .map((row: any) => ({
            referringPageTitle: row[titleCol].trim(),
            referringPageURL: row[urlCol].trim(),
            linksTo: row[linksCol].trim(),
          }))

        setData(filteredRows)
        setLoading(false)
      },
      error: (err) => {
        console.error("Error parsing CSV:", err)
        setError("Failed to load backlinks data. Please try again later.")
        setLoading(false)
      },
    })
  }, [])

  const totalPages = Math.ceil(data.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = data.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPaginationItems = () => {
    let items: (number | "ellipsis")[] = []
    if (totalPages <= 5) {
      items = Array.from({ length: totalPages }, (_, i) => i + 1)
    } else {
      if (currentPage <= 3) {
        items = [1, 2, 3, 4, "ellipsis", totalPages]
      } else if (currentPage >= totalPages - 2) {
        items = [1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
      } else {
        items = [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages]
      }
    }
    return items
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-sm text-destructive">{error}</div>
      </Card>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-lg border bg-gradient-to-br from-card to-card/50 shadow-sm"
    >
      <div className="relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading backlinks data...
            </div>
          </div>
        ) : data.length > 0 ? (
          <div className="flex flex-col">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/60">
                    <TableHead className="w-[300px] font-semibold">Page Title</TableHead>
                    <TableHead className="min-w-[200px] font-semibold">URL</TableHead>
                    <TableHead className="min-w-[200px] font-semibold">Links To</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentData.map((item, idx) => (
                    <TableRow key={idx} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium">
                        <div className="line-clamp-2">{item.referringPageTitle}</div>
                      </TableCell>
                      <TableCell>
                        <a
                          href={item.referringPageURL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-clamp-1 text-primary underline-offset-4 hover:underline"
                        >
                          {item.referringPageURL}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a
                          href={item.linksTo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="line-clamp-1 text-primary underline-offset-4 hover:underline"
                        >
                          {item.linksTo}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-4 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} results
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(currentPage - 1)
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    {getPaginationItems().map((item, idx) =>
                      item === "ellipsis" ? (
                        <PaginationItem key={idx} className="hidden sm:block">
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={idx} className="hidden sm:block">
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              handlePageChange(item as number)
                            }}
                            isActive={item === currentPage}
                          >
                            {item}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          handlePageChange(currentPage + 1)
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">No backlinks data available.</div>
        )}
      </div>
    </motion.div>
  )
}

