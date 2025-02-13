import { useContext, useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { MessageType, Player, Role } from "../../types";
import { WebSocketContext } from "../../contexts/WSContext";
import { PlayerList } from "../../components/PlayersList/PlayerList";
import { RoleList } from "../../components/RolesList/RoleList";

interface LobbyProps {
  players: Player[];
  roles: Role[];
  hostId: string;
  playerId: string;
  roomId: string;
}

export function Lobby({
  players,
  roles,
  hostId,
  playerId,
  roomId,
}: LobbyProps) {
  const [copyFeedback, setCopyFeedback] = useState("");
  const [subscribe, unsubscribe, send] = useContext(WebSocketContext);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);

  useEffect(() => {
    if (playerId == hostId) send({ type: MessageType.GET_ROLES });
  }, []);

  useEffect(() => {
    const channel = "roles";

    subscribe(channel, (data: Role[]) => {
      setAvailableRoles(data);
      console.log(data);
    });

    return () => unsubscribe(channel);
  }, [subscribe, unsubscribe]);

  const handleCopyLink = () => {
    setCopyFeedback("Invite link copied!");

    navigator.clipboard.writeText(`${import.meta.env.VITE_DEV_URL}?${roomId}`);

    setTimeout(() => {
      setCopyFeedback("");
    }, 2000);
  };

  return (
    <div className="flex flex-col justify-center items-center md:h-full">
      <div></div>
      <div className=" flex gap-5  md:flex-row flex-col">
        <PlayerList players={players} hostId={hostId} playerId={playerId} />
        <RoleList
          roles={roles}
          availableRoles={availableRoles}
          numPlayers={players.length}
          isHost={playerId == hostId}
        />
      </div>
      <div className="mt-10">
        <Button onClick={handleCopyLink}>invite link</Button>
        <p className=" text-center h-[16px]">{copyFeedback}</p>
      </div>
    </div>
  );
}
