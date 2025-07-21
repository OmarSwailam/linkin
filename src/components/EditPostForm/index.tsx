import { useState } from "react"
import { useUpdatePost } from "../../hooks/usePosts"
import "./editPostForm.css"
import toast from "react-hot-toast"
import type { PostType } from "../../types"

interface EditPostFormProps {
    post: PostType
    onClose: () => void
}
export default function EditPostForm({ post, onClose }: EditPostFormProps) {
    const [text, setText] = useState(post.text)
    const [images, setImages] = useState(post.images)
    const [imageInput, setImageInput] = useState("")

    const { mutate: updatePost, isPending } = useUpdatePost(post.uuid)

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

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!text.trim() && images.length === 0) {
            toast.error("Post must have text or images")
            return
        }

        updatePost(
            { text, images },
            {
                onSuccess: () => {
                    toast.success("Post updated")
                    onClose()
                },
            }
        )
    }

    return (
        <form className="edit-post-form" onSubmit={handleSubmit}>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="edit-post-textarea"
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
                                onClick={() => handleRemoveImage(idx)}
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="edit-post-actions">
                <button type="button" className="cancel-btn" onClick={onClose}>
                    Cancel
                </button>
                <button type="submit" className="update-btn" disabled={isPending}>
                    {isPending ? "Updating..." : "Update"}
                </button>
            </div>
        </form>
    )
}