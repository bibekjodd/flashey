import { poppins } from '@/lib/fonts';

export default function page() {
  return (
    <div
      className={`hidden min-h-screen bg-gray-900 lg:block ${poppins.className} text-center`}
    >
      <main className="flex flex-col py-10">
        <h1 className="bg-gradient-to-br from-rose-500 to-yellow-500 bg-clip-text text-5xl font-bold text-transparent">
          Flashey
        </h1>
        <div className="mt-7 space-y-2 text-gray-400">
          <p>Instant messages all over the internet</p>
          <p>Stay connected forever</p>
        </div>
      </main>
    </div>
  );
}
