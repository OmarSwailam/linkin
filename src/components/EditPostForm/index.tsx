import { useState } from "react"
import { useUpdatePost, useDeletePost } from "../../hooks/usePosts"
import "./editPostForm.css"
import toast from "react-hot-toast"
import type { PostType } from "../../types"
import Modal from "../Modal"

interface EditPostFormProps {
    post: PostType
    onClose: () => void
}

export default function EditPostForm({ post, onClose }: EditPostFormProps) {
    const [text, setText] = useState(post.text)
    const [images, setImages] = useState(post.images)
    const [imageInput, setImageInput] = useState("")
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)

    const { mutate: updatePost, isPending: isUpdating } = useUpdatePost(post.uuid)
    const { mutate: deletePost, isPending: isDeleting } = useDeletePost(post.uuid)

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

    const handleConfirmDelete = () => {
        deletePost(undefined, {
            onSuccess: () => {
                toast.success("Post deleted")
                onClose()
            },
        })
    }

    return (
        <>
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
                    <button type="submit" className="update-btn" disabled={isUpdating}>
                        {isUpdating ? "Updating..." : "Update"}
                    </button>
                    <button
                        type="button"
                        className="delete-btn"
                        onClick={() => setShowConfirmDelete(true)}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>
            </form>

            {showConfirmDelete && (
                <Modal title="Delete Post" onClose={() => setShowConfirmDelete(false)}>
                    <div style={{ padding: "1rem" }}>
                        <p>Are you sure you want to delete this post? This action cannot be undone.</p>
                        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1rem" }}>
                            <button className="cancel-btn" onClick={() => setShowConfirmDelete(false)}>
                                Cancel
                            </button>
                            <button className="confirm-delete-btn" onClick={handleConfirmDelete}>
                                Confirm Delete
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </>
    )
}
