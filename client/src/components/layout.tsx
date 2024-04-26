import { useSocket } from '@/store/useSocket';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type notification = {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
};

export default function Layout() {
  const navigate = useNavigate();
  const socket = useSocket((s) => s.socket);

  useEffect(() => {
    if (!socket) {
      navigate('/auth');
      return;
    }

    socket.on('disconnect', () => {
      navigate('/auth');
    });

    socket.on('notification', (data: notification) => {
      switch (data.type) {
        case 'info':
          toast.info(data.title, { description: data.message });
          break;
        case 'success':
          toast.success(data.title, { description: data.message });
          break;
        case 'warning':
          toast.warning(data.title, { description: data.message });
          break;
        case 'error':
          toast.error(data.title, { description: data.message });
          break;
        default:
          break;
      }
    });

    return () => {
      socket.off('notification');
      socket.off('disconnect');
    };
  }, [socket, navigate]);

  return (
    <div className='container py-4'>
      <Outlet />
    </div>
  );
}
