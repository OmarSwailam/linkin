import { useState } from "react"
import toast from "react-hot-toast"

import "./createPostForm.css"
import { useCreatePost } from "../../hooks/usePosts"

interface CreatePostFormProps {
    onSuccess?: () => void
}

export default function CreatePostForm({ onSuccess }: CreatePostFormProps) {
    const [text, setText] = useState("")
    const [images, setImages] = useState<string[]>([])
    const [imageInput, setImageInput] = useState("")

    const { mutate, isPending } = useCreatePost()

    const isValidImageUrl = (url: string) => {
        try {
            const valid = new URL(url)
            return /\.(jpg|jpeg|png|gif|webp)$/i.test(valid.pathname)
        } catch {
            return false
        }
    }

    const handleAddImage = () => {
        const url = imageInput.trim()
        if (!url) return
        if (!isValidImageUrl(url)) {
            toast.error("Invalid image URL")
            return
        }
        if (images.includes(url)) {
            toast.error("Image already added")
            return
        }
        setImages([...images, url])
        setImageInput("")
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!text.trim() && images.length === 0) {
            toast.error("A post must have text and/or images")
            return
        }

        mutate(
            { text, images },
            {
                onSuccess: () => {
                    setText("")
                    setImages([])
                    setImageInput("")
                    onSuccess?.()
                },
            }
        )
    }

    return (
        <form className="create-post-form" onSubmit={handleSubmit}>
            <textarea
                placeholder="What's on your mind?"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="create-post-textarea"
            />

            <div className="image-url-input">
                <input
                    type="text"
                    placeholder="Paste image URL"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddImage()
                        }
                    }}
                />
                <button
                    type="button"
                    onClick={handleAddImage}
                    disabled={!imageInput.trim()}
                >
                    Add
                </button>
            </div>

            {images.length > 0 && (
                <div className="create-post-images-preview">
                    {images.map((img, idx) => (
                        <div key={idx} className="image-preview-wrapper">
                            <img src={img} alt="preview" />
                            <button
                                type="button"
                                className="remove-image-btn"
                                onClick={() =>
                                    setImages((prev) => prev.filter((_, i) => i !== idx))
                                }
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button type="submit" disabled={isPending}>
                {isPending ? "Posting..." : "Post"}
            </button>
        </form>
    )
}
