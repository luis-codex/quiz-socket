import useCopy from '@/hooks/useCopy';
import { AnimatePresence, motion } from 'framer-motion';
import { Copy, CopyCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '../../components/ui/button';
import { Auth, useSocket } from '../../store/useSocket';

function BtnSendMsg() {
  const socket = useSocket((state) => state.socket);
  const handleMsg = () => {
    socket?.emit('message', 'Hello from client ' + new Date().getTime());
  };
  return <Button onClick={handleMsg}>Send message</Button>;
}

function Message() {
  const socket = useSocket((state) => state.socket);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (!socket) return;
    socket.on('message', (msg: string) => {
      setMessage(msg);
    });
    return () => {
      socket.off('message');
    };
  }, [socket]);
  return <p>{message}</p>;
}

function Partipants() {
  const socket = useSocket((state) => state.socket);
  const [participants, setParticipants] = useState<Auth[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('get-participants');

    socket.on('participants', setParticipants);
    return () => {
      socket.off('participants');
    };
  }, [socket]);

  return (
    <ul className='flex -space-x-4 rtl:space-x-reverse'>
      <AnimatePresence>
        {participants.map((p) => (
          <motion.img
            layoutId={p.avatarUrl}
            className='size-10 rounded-full border data-[loading="true"]:bg-border data-[loading="true"]:animate-pulse'
            src={p.avatarUrl}
            alt={p.name}
            width='30'
            height='30'
            key={p.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            data-loading='true'
            onLoad={(e) =>
              e.currentTarget.setAttribute('data-loading', 'false')
            }
          />
        ))}
      </AnimatePresence>
    </ul>
  );
}

function Profile() {
  const getAuth = useSocket((state) => state.getAuth);
  const auth = getAuth();
  const { copied, handleCopy } = useCopy();
  if (!auth) return null;

  return (
    <div className='flex gap-2 max-w-40'>
      <img
        src={auth.avatarUrl}
        alt={auth.name}
        className='size-10 rounded-full grid-rows-2'
      />
      <div className='truncate'>
        <p className='font-bold'>{auth.name}</p>
        <div className='flex gap-1'>
          <p className='text-xs text-gray-500 truncate'>{auth.roomId}</p>
          <button
            onClick={() => handleCopy(auth.roomId)}
            data-copied={copied}
            className='*:size-3 data-[copied="true"]:text-green-500'
          >
            {copied ? <CopyCheck /> : <Copy />}
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <nav className='flex justify-between'>
        <Partipants />
        <Profile />
      </nav>
      <hr />
      <br />
      <h1>Socket.io</h1>
      <BtnSendMsg />
      <Message />
    </div>
  );
}

export default App;
