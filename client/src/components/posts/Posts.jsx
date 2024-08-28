import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from '@tanstack/react-query'
import { makeRequest } from "../../axios";


const Posts = () => {
  //TEMPORARY
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => makeRequest.get("/posts").then((res) => res.data),
  });

  console.log(data);

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
          ? "Loading"
          : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  )

};

export default Posts;
