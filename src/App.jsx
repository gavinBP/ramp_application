import { useEffect, useRef, useState } from "react";

export default function App() {
  // ⬇️ Replace with the URL you got from Step 1
  const FLAG_URL = "https://wgg522pwivhvi5gqsn675gth3q0otdja.lambda-url.us-east-1.on.aws/616d69";

  const [flag, setFlag] = useState("");
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch(FLAG_URL, { signal: controller.signal });
        const text = await res.text();
        if (isMounted) {
          setFlag(text.trim());
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [FLAG_URL]);

  // Typewriter: 500ms per character, starts after load, runs once
  useEffect(() => {
    if (loading || !flag || hasAnimatedRef.current) return;

    hasAnimatedRef.current = true; // prevent re-running
    setVisibleCount(0);

    const interval = setInterval(() => {
      setVisibleCount((c) => {
        if (c + 1 >= flag.length) {
          clearInterval(interval);
          return flag.length;
        }
        return c + 1;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [loading, flag]);

  if (loading) return <div>Loading...</div>;

  const chars = flag.slice(0, visibleCount).split("");

  return (
    <div>
      <h1>Flag</h1>
      <ul>
        {chars.map((ch, i) => (
          <li key={i}>{ch}</li>
        ))}
      </ul>

      {/*
        Bonus (the script I used in Step 1):

        (() => {
          const nodes = document.querySelectorAll(
            'section[data-id^="92"] article[data-class$="45"] div[data-tag*="78"] b.ref[value]'
          );
          const url = Array.from(nodes, n => n.getAttribute('value')).join('');
          console.log('URL:', url);
          return url;
        })();
      */}
    </div>
  );
}
