import { useSelector } from "react-redux";
import ProfileCard from "../components/utils/ProfileCard";

const ProfilePage = () => {
  const user = useSelector((state) => state.user.data);
  return (
    <div className="content flex flex-col">
      <ProfileCard user={user} />
    </div>
  );
};

export default ProfilePage;
