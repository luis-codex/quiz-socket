import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Auth, useSocket } from '@/store/useSocket';
import isUrl from '@/utils/is-url';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

// interface Category {
//   id: string;
//   name: string;
//   icon: string;
// }

// function Categories() {
//   const [categories, setCategories] = useState<Category[]>([]);

//   useEffect(() => {
//     fetch('http://localhost:3000/categories')
//       .then((res) => res.json())
//       .then((data) => {
//         setCategories(data);
//       });
//   }, []);

//   return (
//     <div className='py-4 space-y-8'>
//       <div>
//         <span className='font-medium'>Categories</span>
//         <br />
//         <span className='text-muted-foreground'>Select one or more</span>
//       </div>
//       <div className='flex flex-wrap gap-8'>
//         {categories.map((category) => (
//           <div key={category.id} className='flex items-center gap-2'>
//             <input
//               type='checkbox'
//               name='categorie'
//               value={category.id}
//               className='!size-6 rounded-full'
//             />
//             <label>{category.name}</label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function Cate

// function TabComponent() {
//   const [active, setActive] = useState(false);
//   const codeInputRef = useRef<HTMLInputElement>(null);

//   const handleGenerateCode = () => {
//     const { current } = codeInputRef;
//     if (!current) return;
//     setActive(!active);

//     current.value = !active ? crypto.randomUUID() : '';
//   };

//   return (
//     <>
//       <h2 className='text-xl font-medium'>Create or join a room</h2>
//       <div className='flex gap-4'>
//         <Button
//           type='button'
//           variant={active ? 'destructive' : 'default'}
//           className='flex gap-2'
//           onClick={handleGenerateCode}
//         >
//           {active ? 'cancel' : 'Generate code'}
//         </Button>
//         <input
//           ref={codeInputRef}
//           name='code'
//           placeholder='enter code'
//           className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 select-all'
//         />
//       </div>
//       {active && <Categories />}
//     </>
//   );
// }

const avatars = [
  'Lilly',
  'Oscar',
  'Lola',
  'Maggie',
  'Ginger',
  'Daisy',
  'Callie',
  'Cali',
  'Cuddles',
  'Bailey',
  'Miss kitty',
  'Mimi',
  'Pumpkin',
  'Oliver',
  'Socks',
  'Sadie',
  'Nala',
  'Simba',
  'Jack',
  'Chloe',
];

const urlBase = 'https://api.dicebear.com/8.x/bottts/svg?size=50&seed=';
function Avatars({
  handleSetAvatar,
}: {
  handleSetAvatar: (url: string) => void;
}) {
  const [currentValue, setCurrentValue] = useState(`${urlBase}${avatars[0]}`);
  const handleAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const url = target.getAttribute('data-url');

    if (url) {
      setCurrentValue(url);
      handleSetAvatar(url);
    }
  };

  return (
    <ul className='flex flex-wrap justify-center gap-4 text-sm sm:px-4 py-5 *:relative *:p-1.5 *:size-14 *:cursor-pointer'>
      {avatars.map((name) => (
        <div
          key={name}
          onClick={handleAvatarClick}
          data-url={`${urlBase}${name}`}
          data-selected={name === currentValue}
        >
          <img src={`${urlBase}${name}`} alt={name} />
          {`${urlBase}${name}` === currentValue && (
            <motion.div
              className='size-[100%] bg-accent absolute inset-0 z-[-1] rounded-full'
              layoutId='pill-tab'
              transition={{ type: 'spring', duration: 0.5 }}
            />
          )}
        </div>
      ))}
    </ul>
  );
}

export default function Page() {
  const setCredentials = useSocket((state) => state.setCredentials);

  const { register, handleSubmit, setValue } = useForm<Auth>();
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<Auth> = (data) => {
    setCredentials({ ...data, id: crypto.randomUUID() });
    navigate('/room');
  };

  const handleGenerateCode = () => {
    const code = crypto.randomUUID();
    setValue('roomId', code);
  };

  const handleSetAvatar = (url: string) => {
    setValue('avatarUrl', url);
  };

  return (
    <div className='space-y-8 max-w-screen-sm mx-auto'>
      <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
        <div className='flex gap-4'>
          <Input placeholder='name' {...register('name', { required: true })} />
          <div className='text-xs text-left text-nowrap'>
            <span className='font-medium'>Time limit</span>
            <br />
            <span className='text-muted-foreground '>(seconds)</span>
          </div>
          <Input
            type='number'
            className='w-20'
            max={120}
            min={5}
            {...register('timeLimit', {
              max: 120,
              min: 5,
              value: 30,
              required: true,
              valueAsNumber: true,
            })}
          />
        </div>
        <Input
          type='text'
          placeholder='avatar url'
          id='avatarUrl'
          {...register('avatarUrl', { required: true, validate: isUrl })}
        />
        <Avatars handleSetAvatar={handleSetAvatar} />
        <div className='flex gap-4'>
          <Button type='button' onClick={handleGenerateCode}>
            generate room
          </Button>
          <Input
            type='text'
            placeholder='room id'
            id='roomId'
            {...register('roomId', { required: true })}
          />
        </div>
        <Button className='w-full' type='submit'>
          submit
        </Button>
      </form>
    </div>
  );
}
