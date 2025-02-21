"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Copy } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

export default function PostHogPage() {
  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const posthogScript = `
    <script>
      !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug getPageViewId".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init('phc_5hwGUfFG9yJ14imFt72TVBAZam7HEL8jRZlah7Ipv3Q', {
          api_host: 'https://us.i.posthog.com',
          person_profiles: 'identified_only',
      })
    </script>
  `.trim()

  const handleCopy = async () => {
    try {
      setIsLoading(true)
      await navigator.clipboard.writeText(posthogScript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4 md:px-6">
      <section className="mx-auto max-w-2xl">
        <header className="mb-6">
          <h2 className="text-3xl font-bold tracking-tight">PostHog Script</h2>
          <p className="mt-2 text-muted-foreground">
            Copy and embed the PostHog initialization script into your application
          </p>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="overflow-hidden border-2 transition-all hover:shadow-lg">
            <CardHeader className="relative space-y-3 pb-4">
              <Badge 
                variant="default" 
                className="absolute right-4 top-4 bg-primary hover:bg-primary/90"
              >
                Script
              </Badge>
              <CardTitle className="text-xl">PostHog Initialization Script</CardTitle>
              <CardDescription>
                Add this script to your HTML head section to enable PostHog analytics
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="relative rounded-md border-2 border-muted bg-muted/50">
                <pre className="max-h-[300px] overflow-auto p-4 text-sm">
                  <code className="block whitespace-pre">{posthogScript}</code>
                </pre>
              </div>

              <Button
                onClick={handleCopy}
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                <AnimatePresence mode="wait">
                  {copied ? (
                    <motion.span
                      key="copied"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Copied!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <Copy className="h-4 w-4" />
                      Copy Script
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Widget */}
        <elevenlabs-convai agent-id="e4dgVVBys5LYmSq3t7Dh"></elevenlabs-convai>
        <script src="https://elevenlabs.io/convai-widget/index.js" async type="text/javascript"></script>
      </section>
    </main>
  )
}
