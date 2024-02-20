import { memo, useEffect, useRef } from 'react';

type Props = {
  fetchNextPage: () => any;
  isFetching: boolean;
  hasNextPage: boolean;
};
function ScrollObserver({ fetchNextPage, isFetching, hasNextPage }: Props) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.at(0)?.isIntersecting) {
          if (!isFetching && hasNextPage) {
            fetchNextPage();
          }
        }
      },
      { threshold: 1 }
    );
    target && observer.observe(target);

    return () => {
      target && observer.unobserve(target);
    };
  }, [observerRef, fetchNextPage, hasNextPage, isFetching]);

  return <span ref={observerRef} />;
}
export default memo(ScrollObserver);
