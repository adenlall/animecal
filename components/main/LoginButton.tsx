'use client';

import { useAniList } from '../providers/AniListProvider';

export default function LoginButton() {
  const { token, login, logout } = useAniList();

  return (
    <button
      onClick={token ? logout : login}
      className="btn flex-center gap-2 m-auto btn-primary  transition-colors"
    >
      <AniListIcon />
      {token ? 'Logout' : 'Login with AniList'}
    </button>
  );
}
const AniListIcon = () => <svg className='fill-primary-content' xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24">
  <path d="M24 17.53v2.421c0 .71-.391 1.101-1.1 1.101h-5l-.057-.165L11.84 3.736c.106-.502.46-.788 1.053-.788h2.422c.71 0 1.1.391 1.1 1.1v12.38H22.9c.71 0 1.1.392 1.1 1.101zM11.034 2.947l6.337 18.104h-4.918l-1.052-3.131H6.019l-1.077 3.131H0L6.361 2.948h4.673zm-.66 10.96l-1.69-5.014l-1.541 5.015h3.23z"></path>
</svg>