import PostForm from "../../components/PostForm";

export default function CreatePage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Post</h1>
      <PostForm />
    </div>
  )
}
