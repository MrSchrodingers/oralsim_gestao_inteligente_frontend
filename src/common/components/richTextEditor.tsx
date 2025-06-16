"use client"

import { useState, useEffect } from "react"
import { Editor } from "@tinymce/tinymce-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const [editorValue, setEditorValue] = useState(value)
  const [editorKey, setEditorKey] = useState(Date.now())

  useEffect(() => {
    setEditorValue(value)
  }, [value])

  useEffect(() => {
    const handleThemeChange = () => {
      setEditorKey(Date.now())
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "class") {
          handleThemeChange()
        }
      })
    })

    const htmlElement = document.documentElement
    observer.observe(htmlElement, { attributes: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
      <Editor
        key={editorKey}
        apiKey="kwljxtxs86q5nmpvonb82mb8w6vi3bgba85z26ie52klkpak" 
        value={editorValue}
        onEditorChange={(newValue) => {
          setEditorValue(newValue)
          onChange(newValue)
        }}
        init={{
          height: 350,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
            "wordcount",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic forecolor | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | " +
            "removeformat | help",
          content_style: `
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
              font-size: 14px; 
              line-height: 1.5;
              padding: 1rem;
            }
          `,
          skin: document.documentElement.classList.contains("dark") ? "oxide-dark" : "oxide",
          content_css: document.documentElement.classList.contains("dark") ? "dark" : "default",
        }}
      />
    </div>
  )
}

