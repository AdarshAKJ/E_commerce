import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { makeRequest } from "../../axios";
import moment from "moment";


const Comments = ({ postId }) => {
  const [desc, setDesc] = useState("");

  const { currentUser } = useContext(AuthContext);
  //Temporary
  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: () => makeRequest.get("/comments?postId=" + postId).then((res) => { return res.data }),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newComments) => {
      return makeRequest.post("/comments", newComments);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
  });


  const handleClick = async (e) => {
    e.preventDefault();
    mutation.mutate({ desc, postId: postId });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          value={desc}
          onChange={e => setDesc(e.target.value)}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {isLoading
        ? "loading..."
        : data.map((comment) => (
          <div className="comment">
            <img src={comment.profilePic} alt="" />
            <div className="info">
              <span>{comment.name}</span>
              <p>{comment.desc}</p>
            </div>
            <span className="date">{moment(comment.createdAt).fromNow()}</span>
          </div>
        ))
      }
    </div>
  );
};

export default Comments;
