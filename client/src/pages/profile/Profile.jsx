import "./profile.scss";
import {
  FacebookTwoTone as FacebookTwoToneIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
  Pinterest as PinterestIcon,
  Twitter as TwitterIcon,
  Place as PlaceIcon,
  Language as LanguageIcon,
  EmailOutlined as EmailOutlinedIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import Posts from "../../components/posts/Posts";
import Update from "../../components/update/Update";

const Loading = () => <div>Loading...</div>;

const Error = ({ message }) => <div>Error: {message}</div>;

const Profile = () => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const userId = parseInt(useLocation().pathname.split("/")[2]);

  const { isLoading, error, data } = useQuery(["user", userId], () =>
    makeRequest.get(`/users/find/${userId}`).then((res) => res.data)
  );

  const { isLoading: rIsLoading, error: rError, data: relationshipData } = useQuery(
    ["relationship", userId],
    () => makeRequest.get(`/relationships?followedUserId=${userId}`).then((res) => res.data)
  );

  const mutation = useMutation(
    (following) =>
      following
        ? makeRequest.delete(`/relationships?userId=${userId}`)
        : makeRequest.post("/relationships", { userId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["relationship", userId]);
      },
    }
  );

  const handleFollow = () => {
    const isFollowing = relationshipData.includes(currentUser.id);
    mutation.mutate(isFollowing);
  };

  if (isLoading || rIsLoading) return <Loading />;
  if (error || rError) return <Error message={error?.message || rError?.message} />;

  return (
    <div className="profile">
      <div className="images">
        {/* <img src={`/upload/${data.coverPic}`} alt={`${data.name}'s cover`} className="cover" /> */}
        <img src={data.coverPic} alt={`${data.name}'s cover`} className="cover" />
        <img src={data.profilePic} alt={`${data.name}'s profile`} className="profilePic" />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon aria-label="Location" />
                <span>{data.city}</span>
              </div>
              <div className="item">
                <LanguageIcon aria-label="Website" />
                <span>{data.website}</span>
              </div>
            </div>
            {userId === currentUser.id ? (
              <button onClick={() => setOpenUpdate(true)} aria-label="Update profile">Update</button>
            ) : (
              <button onClick={handleFollow} aria-label={relationshipData.includes(currentUser.id) ? "Unfollow" : "Follow"}>
                {relationshipData.includes(currentUser.id) ? "Following" : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon aria-label="Email" />
            <MoreVertIcon aria-label="More options" />
          </div>
        </div>
        <Posts userId={userId} />
      </div>
      {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
    </div>
  );
};

export default Profile;
