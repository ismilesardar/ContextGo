import { Session } from 'better-auth/types';
import { SessionCard } from './session-card';

export const CurrentSession = ({
  currentSessionToken,
  listOfSessions
}: {
  currentSessionToken: string;
  listOfSessions: Session[];
}) => {
  const currentSession = listOfSessions.find(
    (session) => session.token === currentSessionToken
  );
  return (
    <>
      <h1 className='text-2xl font-bold'>Current Session</h1>
      <SessionCard session={currentSession!} isCurrentSession={true} />
    </>
  );
};
