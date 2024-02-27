import { concertOne, poppins } from '@/lib/fonts';

export default function page() {
  return (
    <div
      className={`relative hidden min-h-screen  place-items-center bg-neutral-50 dark:bg-gray-900 lg:grid ${poppins.className} text-center`}
    >
      <main className="flex h-full w-full flex-col justify-center py-10">
        <h1 className="bg-gradient-to-tr from-rose-500 to-yellow-500 bg-clip-text text-6xl font-bold">
          <span
            className={`${concertOne.className} bg-gradient-to-r from-pink-500 via-fuchsia-500
            to-sky-400 bg-clip-text text-transparent
            `}
          >
            Flashey
          </span>
        </h1>
        <div className="mt-5 space-y-2 text-gray-400 dark:text-gray-300/70">
          <p>Instant messages all over the internet</p>
          <p>Stay connected forever</p>
        </div>
      </main>

      <div className="absolute inset-0"></div>
    </div>
  );
}
