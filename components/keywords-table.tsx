"use client"

import { useEffect, useState } from "react"
import Papa from "papaparse"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Search, ArrowUpDown, ExternalLink } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface KeywordData {
  keyword: string
  countryCode: string
  location: string
  serpFeatures: string
  volume: string
  kd: string
  organicTraffic: string
  currentPosition: string
  currentUrl: string
}

export function KeywordsTable() {
  const [data, setData] = useState<KeywordData[]>([])
  const [filteredData, setFilteredData] = useState<KeywordData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{
    key: keyof KeywordData | null
    direction: "ascending" | "descending"
  }>({ key: null, direction: "ascending" })
  const pageSize = 5

  useEffect(() => {
    Papa.parse("/keywords.csv", {
      download: true,
      header: true,
      complete: (results) => {
        // Expected column names (in lowercase for comparison)
        const expectedKeyword = "keyword"
        const expectedCountryCode = "country code"
        const expectedLocation = "location"
        const expectedSerpFeatures = "serp features"
        const expectedVolume = "volume"
        const expectedKd = "kd"
        const expectedOrganicTraffic = "organic traffic"
        const expectedCurrentPosition = "current position"
        const expectedCurrentUrl = "current url"

        // Default to the expected values
        let keywordCol = expectedKeyword
        let countryCodeCol = expectedCountryCode
        let locationCol = expectedLocation
        let serpFeaturesCol = expectedSerpFeatures
        let volumeCol = expectedVolume
        let kdCol = expectedKd
        let organicTrafficCol = expectedOrganicTraffic
        let currentPositionCol = expectedCurrentPosition
        let currentUrlCol = expectedCurrentUrl

        if (results.data?.length) {
          const firstRow = results.data[0] as Record<string, any>
          const keys = Object.keys(firstRow)

          const foundKeyword = keys.find((k) => k.trim().toLowerCase() === expectedKeyword)
          if (foundKeyword) keywordCol = foundKeyword

          const foundCountryCode = keys.find((k) => k.trim().toLowerCase() === expectedCountryCode)
          if (foundCountryCode) countryCodeCol = foundCountryCode

          const foundLocation = keys.find((k) => k.trim().toLowerCase() === expectedLocation)
          if (foundLocation) locationCol = foundLocation

          const foundSerpFeatures = keys.find((k) => k.trim().toLowerCase() === expectedSerpFeatures)
          if (foundSerpFeatures) serpFeaturesCol = foundSerpFeatures

          const foundVolume = keys.find((k) => k.trim().toLowerCase() === expectedVolume)
          if (foundVolume) volumeCol = foundVolume

          const foundKd = keys.find((k) => k.trim().toLowerCase() === expectedKd)
          if (foundKd) kdCol = foundKd

          const foundOrganicTraffic = keys.find(
            (k) => k.trim().toLowerCase() === expectedOrganicTraffic,
          )
          if (foundOrganicTraffic) organicTrafficCol = foundOrganicTraffic

          const foundCurrentPosition = keys.find(
            (k) => k.trim().toLowerCase() === expectedCurrentPosition,
          )
          if (foundCurrentPosition) currentPositionCol = foundCurrentPosition

          const foundCurrentUrl = keys.find((k) => k.trim().toLowerCase() === expectedCurrentUrl)
          if (foundCurrentUrl) currentUrlCol = foundCurrentUrl
        }

        const filteredRows = results.data
          .filter(
            (row: any) =>
              row[keywordCol] &&
              row[countryCodeCol] &&
              row[locationCol] &&
              row[serpFeaturesCol] &&
              row[volumeCol] &&
              row[kdCol] &&
              row[organicTrafficCol] &&
              row[currentPositionCol] &&
              row[currentUrlCol],
          )
          .map((row: any) => ({
            keyword: row[keywordCol].trim(),
            countryCode: row[countryCodeCol].trim(),
            location: row[locationCol].trim(),
            serpFeatures: row[serpFeaturesCol].trim(),
            volume: row[volumeCol].trim(),
            kd: row[kdCol].trim(),
            organicTraffic: row[organicTrafficCol].trim(),
            currentPosition: row[currentPositionCol].trim(),
            currentUrl: row[currentUrlCol].trim(),
          }))

        setData(filteredRows)
        setFilteredData(filteredRows)
        setLoading(false)
      },
      error: (err) => {
        console.error("Error parsing CSV:", err)
        setError("Failed to load keyword data. Please try again later.")
        setLoading(false)
      },
    })
  }, [])

  // Search and filter functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredData(data)
    } else {
      const lowercaseQuery = searchQuery.toLowerCase()
      const filtered = data.filter((item) =>
        item.keyword.toLowerCase().includes(lowercaseQuery)
      )
      setFilteredData(filtered)
    }
    setCurrentPage(1) // Reset to first page on search
  }, [searchQuery, data])

  // Sorting functionality
  const requestSort = (key: keyof KeywordData) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  useEffect(() => {
    if (sortConfig.key) {
      const sortedData = [...filteredData].sort((a, b) => {
        if (a[sortConfig.key!] < b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? -1 : 1
        }
        if (a[sortConfig.key!] > b[sortConfig.key!]) {
          return sortConfig.direction === "ascending" ? 1 : -1
        }
        return 0
      })
      setFilteredData(sortedData)
    }
  }, [sortConfig])

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const currentData = filteredData.slice(startIndex, endIndex)

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

  // Get sort direction indicator
  const getSortDirectionIcon = (key: keyof KeywordData) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "ascending" ? "↑" : "↓"
    }
    return null
  }

  if (error) {
    return (
      <Card className="p-6 border-destructive/50 bg-destructive/5">
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
              <span className="animate-pulse">Loading keywords data...</span>
            </div>
          </div>
        ) : filteredData.length > 0 ? (
          <div className="flex flex-col">
           
            
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/60">
                    <TableHead 
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => requestSort("keyword")}
                    >
                      <div className="flex items-center gap-1">
                        Keyword
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        {getSortDirectionIcon("keyword") && (
                          <span className="ml-1 text-primary">{getSortDirectionIcon("keyword")}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Country code</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>SERP features</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => requestSort("volume")}
                    >
                      <div className="flex items-center gap-1">
                        Volume
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        {getSortDirectionIcon("volume") && (
                          <span className="ml-1 text-primary">{getSortDirectionIcon("volume")}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => requestSort("kd")}
                    >
                      <div className="flex items-center gap-1">
                        KD
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        {getSortDirectionIcon("kd") && (
                          <span className="ml-1 text-primary">{getSortDirectionIcon("kd")}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Organic traffic</TableHead>
                    <TableHead 
                      className="cursor-pointer hover:text-primary transition-colors"
                      onClick={() => requestSort("currentPosition")}
                    >
                      <div className="flex items-center gap-1">
                        Position
                        <ArrowUpDown className="h-3.5 w-3.5" />
                        {getSortDirectionIcon("currentPosition") && (
                          <span className="ml-1 text-primary">{getSortDirectionIcon("currentPosition")}</span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead>Current URL</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence mode="wait">
                    {currentData.map((item, idx) => (
                      <motion.tr
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="group transition-colors hover:bg-muted/50"
                      >
                        <TableCell className="font-medium">{item.keyword}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-primary/5">
                            {item.countryCode}
                          </Badge>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.serpFeatures}</TableCell>
                        <TableCell>{item.volume}</TableCell>
                        <TableCell>{item.kd}</TableCell>
                        <TableCell>{item.organicTraffic}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={parseInt(item.currentPosition) <= 10 ? "default" : "secondary"}
                            className={parseInt(item.currentPosition) <= 3 ? "bg-green-500" : ""}
                          >
                            {item.currentPosition}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <a
                            href={item.currentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-primary underline-offset-4 hover:underline group-hover:text-primary/80"
                          >
                            <span className="truncate max-w-[200px]">{item.currentUrl}</span>
                            <ExternalLink className="h-3.5 w-3.5 opacity-70" />
                          </a>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t px-4 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} results
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
          <div className="p-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No keyword data found</h3>
            <p className="text-sm text-muted-foreground">
              {searchQuery ? "Try a different search term" : "No keyword data available."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
