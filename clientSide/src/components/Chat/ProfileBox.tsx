import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileBoxProps {
  name: string | null;
  member: number | null;
  profile?: string;
}

const ProfileBox: React.FC<ProfileBoxProps> = ({ name, member, profile }) => {
  return (
    <div className="flex flex-row items-center gap-[10px]">
      {profile != null ? (
        <Avatar className="w-9 h-9">
          <AvatarImage width={28} src={profile} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ) : (
        ""
      )}
      <div className="flex flex-col">
        <div className="text-base font-semibold">{name}</div>
        <div className="text-[10px] font-medium">
          {member != null ? <>Members: {member}</> : ""}
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
