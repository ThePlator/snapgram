import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

const PostCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post.creator) return;

  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post.creator.$id}`}>
            <img
              className="rounded-full w-12 h-12"
              src={post?.creator?.imageUrl || "/assets/icons/profile-placeholder.svg"}
              width={48}
              height={48}
              alt="Creator image"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">{post.creator.name}</p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString(post.$createdAt)}
              </p>
              -<p className="subtle-semibold lg:small-regular">{post.location}</p>
            </div>
          </div>
        </div>

        <Link
          className={`${user.id !== post.creator.$id ? "hidden" : ""}`}
          to={`/update-post/${post.$id}`}
        >
          <img src="/assets/icons/edit.svg" width={20} height={20} alt="Edit icon" />
        </Link>
      </div>
      <Link to={`/post/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <h4>{post.caption}</h4>
          <ul className="flex gap-1 mt-2">
            {post.tags.map((tag: string, index: number) => (
              <li key={`${tag}-${index}`} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          className="post-card_img"
          alt="Post image"
        />
      </Link>
      <PostStats post={post} userId={user.id} />
    </div>
  );
};

export default PostCard;
