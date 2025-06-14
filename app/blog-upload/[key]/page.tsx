"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ref as dbRef,
  child,
  get,
  set,
  remove as dbRemove,
} from "firebase/database";
import {
  ref as stRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
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

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams<{ key: string }>();
  const key = params.key;

  /* ---------- pin-gate ---------- */
  const [pinOk, setPinOk] = useState(false);
  const [pin, setPin] = useState("");

  /* ---------- blog state ---------- */
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    date: "",
    readTime: "",
    url: "",
    status: "pending" as "pending" | "published",
    imageUrl: "/outline.png",
  });
  const [imageChoice, setImageChoice] =
    useState<"keep" | "outline" | "upload">("keep");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* ---------- fetch post once pin is correct ---------- */
  useEffect(() => {
    if (!pinOk) return;
    const ref = child(
      dbRef(db),
      `blogUploadsNew/${COMPANY_NAME}/${key}`
    );
    get(ref).then((snap) => {
      if (snap.exists()) setForm(snap.val());
      else router.replace("/blog-upload");
    });
  }, [pinOk, key, router]);

  /* ---------- save ---------- */
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      let imageUrl = form.imageUrl;

      if (imageChoice === "outline") imageUrl = "/outline.png";
      if (imageChoice === "upload" && file) {
        const ref = stRef(
          storage,
          `blogImages/${Date.now()}_${file.name}`
        );
        await uploadBytes(ref, file);
        imageUrl = await getDownloadURL(ref);
      }

      await set(
        child(dbRef(db), `blogUploadsNew/${COMPANY_NAME}/${key}`),
        {
          ...form,
          date: form.date, // store raw string
          imageUrl,
        }
      );

      router.back();
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setSubmitting(false);
    }
  }

  /* ---------- delete ---------- */
  async function handleDelete() {
    if (!confirm("Delete this blog permanently?")) return;
    try {
      await dbRemove(
        child(dbRef(db), `blogUploadsNew/${COMPANY_NAME}/${key}`)
      );
      router.push("/");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  }

  /* ---------- render ---------- */
  if (!pinOk) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-80">
          <CardHeader>
            <h1 className="text-xl font-bold text-center">Enter PIN</h1>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            {pin && pin !== "0000" && (
              <p className="text-sm text-destructive">Wrong PIN</p>
            )}
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => {
                if (pin === "0000") setPinOk(true);
              }}
            >
              Unlock
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto max-w-2xl p-6"
    >
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Edit Blog</h1>
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
                setImageChoice(v as "keep" | "outline" | "upload")
              }
              className="flex gap-6"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="keep" id="keep" />
                <Label htmlFor="keep">Keep current</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="outline" id="outline" />
                <Label htmlFor="outline">Use /outline.png</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="upload" id="upload" />
                <Label htmlFor="upload">Upload new</Label>
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

        <CardFooter className="flex flex-col gap-4 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </Button>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? "Saving…" : "Save changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
