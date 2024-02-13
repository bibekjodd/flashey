'use client';
import { useSearch } from '@/hooks/queries/useSearch';
import { useDebounce } from '@/hooks/useDebounce';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useState } from 'react';
import Avatar from '../ui/avatar';
import { Input } from '../ui/input';

export default function Search() {
  const [query, setQuery] = useState('');
  const searchEnabled = useDebounce(query, 300);
  const { data, isLoading, isFetching, isPending, error } = useSearch(
    query,
    searchEnabled
  );
  const searchResults = data?.pages.flat(1) || [];

  return (
    <section className="relative focus:outline-none">
      <div className="relative">
        <Input
          placeholder="Search chats..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <XMarkIcon className="h-4 w-4 text-neutral-700" />
          </button>
        )}
      </div>
      {query && (
        <div className="absolute top-full z-10 mt-2 w-full space-y-1 rounded-lg border bg-white/80 p-2 py-4 filter backdrop-blur-md">
          <h4 className="text-sm font-medium">Results:</h4>
          {!isLoading && !isFetching && !isPending && !searchResults.length && (
            <p className="text-sm font-medium text-gray-500">
              No results found for {query}
            </p>
          )}
          {error && (
            <p className="text-sm font-medium text-rose-400">{error.message}</p>
          )}
          {searchResults.map((result) => (
            <Link
              onClick={() => {
                setQuery('');
              }}
              href={`/messages/${result.id}`}
              key={result.id}
              className="flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:bg-neutral-100"
            >
              <Avatar src={result.image} />
              <span>{result.name}</span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
