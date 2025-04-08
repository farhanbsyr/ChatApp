interface ProfileBoxProps {
  name: string | null;
  member: number | null;
}

const ProfileBox: React.FC<ProfileBoxProps> = ({ name, member }) => {
  return (
    <div className="flex flex-row ">
      <div className="flex flex-col">
        <div className="text-base font-semibold">{name}</div>
        <div className="text-[10px] font-light">
          {member != null ? member : ""}
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
