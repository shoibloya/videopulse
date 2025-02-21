//components/keywords-table.tsx

"use client"

import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface KeywordData {
  keyword: string
  intent: string
  sf: string | number
  volume: number
  kd: number
  cpc: string | number
  traffic: number
  paid: number
  position: number
  url: string
  updated: string
}

export function KeywordsTable({ data }: { data: KeywordData[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-lg border bg-gradient-to-br from-card to-card/50 shadow-sm"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/60">
              <TableHead className="font-semibold">Keyword</TableHead>
              <TableHead>Intent</TableHead>
              <TableHead className="text-right">Volume</TableHead>
              <TableHead className="text-right">KD</TableHead>
              <TableHead className="text-right">Traffic</TableHead>
              <TableHead className="text-right">Position</TableHead>
              <TableHead>URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, idx) => (
              <TableRow key={idx} className="transition-colors hover:bg-muted/50">
                <TableCell className="font-medium text-primary">{item.keyword}</TableCell>
                <TableCell>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {item.intent}
                  </span>
                </TableCell>
                <TableCell className="text-right">{item.volume}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.kd > 10 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.kd}
                  </span>
                </TableCell>
                <TableCell className="text-right">{item.traffic}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      item.position > 30
                        ? "bg-red-100 text-red-700"
                        : item.position > 10
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {item.position}
                  </span>
                </TableCell>
                <TableCell>
                  <a
                    href={item.url}
                    className="text-primary underline-offset-4 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.url}
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}
