import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Loading = () => <div>Loading...</div>;

const Error = ({ message }) => <div>Error: {message}</div>;

const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["comments", postId], () =>
    makeRequest.get(`/comments?postId=${postId}`).then((res) => res.data)
  );

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (newComment) => makeRequest.post("/comments", newComment),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["comments", postId]);
      },
    }
  );

  const handleClick = (e) => {
    e.preventDefault();
    if (desc.trim()) {
      mutation.mutate({ desc, postId });
      setDesc("");
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <Error message="Something went wrong" />;

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt={`${currentUser.name}'s profile`} />
        <input
          type="text"
          placeholder="Write a comment..."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          aria-label="Write a comment"
        />
        <button onClick={handleClick} aria-label="Send comment">
          Send
        </button>
      </div>
      {data.length === 0 ? (
        <div className="no-comments">No comments yet. Be the first to comment!</div>
      ) : (
        data.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={comment.profilePic} alt={`${comment.name}'s profile`} />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default Comments;
