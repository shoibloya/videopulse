"use client"

import { useEffect, useState } from "react"
import Papa from "papaparse"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Line } from "react-chartjs-2"
import annotationPlugin from "chartjs-plugin-annotation"  // <-- Added import

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin  // <-- Register the annotation plugin
)

interface TrafficRow {
  [key: string]: any
}

export function TrafficChart() {
  const [trafficData, setTrafficData] = useState<TrafficRow[]>([])
  const [trafficColName, setTrafficColName] = useState("Organic Traffic")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Papa.parse("/traffic.csv", {
      download: true,
      header: true,
      complete: (results) => {
        console.log("Raw parsed traffic data:", results.data)

        // Function to find the column matching "Organic Traffic" (ignoring case/spaces)
        const findColName = (cols: string[]) => {
          return cols.find((c) => c.trim().toLowerCase() === "organic traffic")
        }

        let col = "Organic Traffic"
        if (results.data?.length) {
          const firstRow = results.data[0] as Record<string, any>
          const colNames = Object.keys(firstRow)
          const found = findColName(colNames)
          if (found) {
            col = found
          } else {
            console.warn(
              "Could not find a column named 'Organic Traffic' in CSV. Using default."
            )
          }
        }
        setTrafficColName(col)

        // Filter rows that have a valid date and non-empty organic traffic value
        const filteredRows = results.data.filter((row: any) => {
          const dateVal = row.Date?.trim() || row.date?.trim()
          const organicVal = row[col]
          return dateVal && organicVal !== undefined && organicVal !== null && organicVal !== ""
        })

        console.log("Filtered traffic data:", filteredRows)
        setTrafficData(filteredRows)
        setLoading(false)
      },
      error: (err) => {
        console.error("Papa Parse Error:", err)
        setLoading(false)
      },
    })
  }, [])

  // Build labels using either "Date" or "date" and traffic values using the detected column
  const labels = trafficData.map(
    (row) => row.Date?.trim() || row.date?.trim() || ""
  )
  const trafficValues = trafficData.map(
    (row) => Number(row[trafficColName]) || 0
  )

  // Calculate the middle label for the annotation. Fallback to a default if no labels available.
  const midLabel = labels.length ? labels[Math.floor(labels.length / 2)] : '2024-09-15'

  const chartData = {
    labels,
    datasets: [
      {
        label: "Organic Traffic",
        data: trafficValues,
        borderColor: "#3b82f6", // Tailwind blue-500
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: "Organic Traffic Over Time",
      },
      legend: {
        position: "bottom" as const,
      },
      // Annotation configuration with hover events for tooltip behavior
      annotation: {
        annotations: {
          clientOnboard: {
            type: 'line',
            scaleID: 'x',
            value: midLabel, // Now using the middle label value
            borderColor: "rgba(255,105,180,1)", // Pinkish color
            borderWidth: 2,
            label: {
              enabled: false, // Hide by default
              content: "Client Onboarded",
              position: "center"
            },
            onEnter: (context: any) => {
              context.element.options.label.enabled = true
              context.chart.update()
            },
            onLeave: (context: any) => {
              context.element.options.label.enabled = false
              context.chart.update()
            }
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Organic Traffic",
        },
        beginAtZero: true,
      },
    },
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm h-96">
      {loading ? (
        <p className="text-center text-sm">Loading traffic data...</p>
      ) : labels.length > 0 ? (
        <Line data={chartData} options={options} />
      ) : (
        <p className="text-center text-sm">No traffic data available.</p>
      )}
    </div>
  )
}
