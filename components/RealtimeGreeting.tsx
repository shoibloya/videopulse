"use client"

import React, { useEffect, useRef, useState } from "react"

interface ChatMessage {
  type: "sent" | "received"
  message: string
}

export default function RealtimeGreeting() {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const pcRef = useRef<RTCPeerConnection | null>(null)
  const dcRef = useRef<RTCDataChannel | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const initConnection = async () => {
      try {
        console.log("Initializing realtime connection...")
        // 1. Fetch an ephemeral API token from our Next.js API route.
        const tokenResponse = await fetch("/api/session")
        if (!tokenResponse.ok) {
          throw new Error(`Token fetch failed: ${tokenResponse.statusText}`)
        }
        const tokenData = await tokenResponse.json()
        console.log("Ephemeral token data:", tokenData)
        const EPHEMERAL_KEY = tokenData.client_secret?.value
        if (!EPHEMERAL_KEY) {
          throw new Error("Ephemeral key not found in token data")
        }

        // 2. Create a new RTCPeerConnection.
        const pc = new RTCPeerConnection()
        pcRef.current = pc
        console.log("RTCPeerConnection created.")

        // 3. Set up remote audio playback.
        let audioEl = audioRef.current
        if (!audioEl) {
          audioEl = document.createElement("audio")
          audioEl.autoplay = true
          audioRef.current = audioEl
          document.body.appendChild(audioEl)
          console.log("Audio element created and appended.")
        }
        pc.ontrack = (event) => {
          console.log("Remote track received:", event)
          if (audioEl && event.streams && event.streams[0]) {
            audioEl.srcObject = event.streams[0]
          }
        }

        // 4. Get local audio (microphone) and add it to the connection.
        const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStream.getTracks().forEach((track) => pc.addTrack(track, mediaStream))
        console.log("Local audio tracks added to connection.")

        // 5. Create a data channel for sending/receiving realtime events.
        const dc = pc.createDataChannel("oai-events")
        dcRef.current = dc

        dc.onopen = () => {
          console.log("Data channel opened.")
          setConnected(true)
          // Automatically initiate conversation once connected.
          initiateConversation()
        }
        dc.onerror = (err) => {
          console.error("Data channel error:", err)
          setError("Data channel encountered an error.")
        }
        dc.onmessage = (event) => {
          console.log("Received message:", event.data)
          try {
            const parsed = JSON.parse(event.data)
            console.log("Parsed message:", parsed)
            setChatMessages((prev) => [
              ...prev,
              { type: "received", message: JSON.stringify(parsed) },
            ])
          } catch (err) {
            console.error("Error parsing message:", err)
          }
        }

        // 6. Create an SDP offer and set it as the local description.
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        console.log("Local SDP offer set:", offer.sdp)

        // 7. Send the SDP offer to the Realtime API endpoint.
        const baseUrl = "https://api.openai.com/v1/realtime"
        const model = "gpt-4o-realtime-preview-2024-12-17"
        const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            "Content-Type": "application/sdp",
          },
        })
        if (!sdpResponse.ok) {
          const errText = await sdpResponse.text()
          throw new Error(`SDP response failed: ${sdpResponse.status} - ${errText}`)
        }
        const answerSdp = await sdpResponse.text()
        console.log("SDP answer received:", answerSdp)

        // 8. Set the remote description with the SDP answer.
        const answer = { type: "answer", sdp: answerSdp }
        await pc.setRemoteDescription(answer)
        console.log("Remote SDP set successfully.")
      } catch (err: any) {
        console.error("Error initializing realtime connection:", err)
        setError("Failed to connect to realtime API: " + err.message)
      }
    }

    initConnection()

    // Cleanup: close the connection and remove the audio element on unmount.
    return () => {
      if (pcRef.current) {
        pcRef.current.close()
        console.log("RTCPeerConnection closed.")
      }
      if (audioRef.current) {
        audioRef.current.remove()
        console.log("Audio element removed.")
      }
    }
  }, [])

  // Automatically initiate a conversation once connected.
  const initiateConversation = () => {
    if (dcRef.current && dcRef.current.readyState === "open") {
      const eventData = {
        type: "response.create",
        response: {
          modalities: ["text"],
          instructions: "Hello, I am your realtime assistant. How can I help you today?",
        },
      }
      console.log("Initiating conversation with event:", eventData)
      dcRef.current.send(JSON.stringify(eventData))
      setChatMessages((prev) => [
        ...prev,
        { type: "sent", message: "Hello, I am your realtime assistant. How can I help you today?" },
      ])
    }
  }

  // Handler for sending a custom text message.
  const sendMessage = () => {
    if (dcRef.current && dcRef.current.readyState === "open" && messageInput.trim()) {
      const eventData = {
        type: "response.create",
        response: {
          modalities: ["text"],
          instructions: messageInput.trim(),
        },
      }
      console.log("Sending custom message:", eventData)
      dcRef.current.send(JSON.stringify(eventData))
      setChatMessages((prev) => [
        ...prev,
        { type: "sent", message: messageInput.trim() },
      ])
      setMessageInput("")
    }
  }

  // Handler for the "Click Me" button.
  // When clicked, it sends an event instructing the agent to respond with "You pressed 'Click Me'".
  const handleButtonClick = () => {
    if (dcRef.current && dcRef.current.readyState === "open") {
      const eventData = {
        type: "response.create",
        response: {
          modalities: ["text"],
          instructions: "You pressed 'Click Me'",
        },
      }
      console.log("Sending Click Me event:", eventData)
      dcRef.current.send(JSON.stringify(eventData))
      setChatMessages((prev) => [
        ...prev,
        { type: "sent", message: "You pressed 'Click Me'" },
      ])
    }
  }

  return (
    <div className="p-4 border rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Realtime Chat with OpenAI</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {!connected && <div className="mb-2 text-gray-500">Connecting...</div>}
      <div className="border p-2 h-64 overflow-y-auto mb-4">
        {chatMessages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          chatMessages.map((msg, idx) => (
            <div key={idx} className={`mb-1 ${msg.type === "sent" ? "text-blue-600" : "text-green-600"}`}>
              {msg.type === "sent" ? "You: " : "Agent: "}
              {msg.message}
            </div>
          ))
        )}
      </div>
      <div className="flex mb-4">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-1 border p-2 rounded-l"
          placeholder="Type your message..."
          disabled={!connected}
        />
        <button onClick={sendMessage} className="px-4 bg-blue-500 text-white rounded-r" disabled={!connected}>
          Send
        </button>
      </div>
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-green-500 text-white rounded"
        disabled={!connected}
      >
        Click Me
      </button>
    </div>
  )
}
