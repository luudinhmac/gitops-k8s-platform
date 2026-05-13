'use client';

import PostEditorPage from './post-editor/PostEditorPage';

interface PostEditorProps {
  postId?: number;
}

export default function PostEditor({ postId }: PostEditorProps) {
  return <PostEditorPage postId={postId} />;
}

