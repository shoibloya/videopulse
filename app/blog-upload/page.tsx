"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ref as dbRef, push as dbPush } from "firebase/database";
import { ref as stRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const COMPANY_NAME = "VideoPulse";

export default function BlogUploadPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    date: "",
    readTime: "",
    url: "",
    status: "pending",
  });
  const [imageChoice, setImageChoice] =
    useState<"outline" | "upload">("outline");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = "/outline.png";
      if (imageChoice === "upload" && file) {
        const uploadRef = stRef(
          storage,
          `blogImages/${Date.now()}_${file.name}`
        );
        await uploadBytes(uploadRef, file);
        imageUrl = await getDownloadURL(uploadRef);
      }

      await dbPush(dbRef(db, `blogUploadsNew/${COMPANY_NAME}`), {
        id: Date.now(),
        ...form,
        date: form.date,  // store raw string
        imageUrl,
      });

      router.push("/");
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto max-w-2xl p-6"
    >
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">New Blog</h1>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <Textarea
            placeholder="Excerpt"
            required
            value={form.excerpt}
            onChange={(e) =>
              setForm({ ...form, excerpt: e.target.value })
            }
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input
              placeholder="Date (e.g. 2025-05-13)"
              required
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
            <Input
              placeholder="Read time"
              value={form.readTime}
              onChange={(e) =>
                setForm({ ...form, readTime: e.target.value })
              }
            />
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm({
                  ...form,
                  status: v as "pending" | "published",
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Input
            placeholder="Google Doc / URL"
            required
            value={form.url}
            onChange={(e) =>
              setForm({ ...form, url: e.target.value })
            }
          />

          <div className="space-y-2">
            <Label className="font-semibold">Cover image</Label>
            <RadioGroup
              value={imageChoice}
              onValueChange={(v) =>
                setImageChoice(v as "outline" | "upload")
              }
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="outline" id="outline" />
                <Label htmlFor="outline">Use /outline.png</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload">Upload</Label>
              </div>
            </RadioGroup>

            {imageChoice === "upload" && (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFile(e.target.files?.[0] ?? null)
                }
              />
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Uploading…" : "Submit"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
