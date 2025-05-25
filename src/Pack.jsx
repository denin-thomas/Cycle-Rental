import React, { useState, useEffect, useRef } from 'react';

export default function Pack() {
  const [scrollPosition, setScrollPosition] = useState(0);
  const containerRef = useRef(null);
  const isMounted = useRef(true); // Ref to track if the component is mounted

  // Define scrollSpeed outside of autoScroll for accessibility
  const scrollSpeed = 1; // Milliseconds between scrolls

  const autoScroll = () => {
    // Check if containerRef or the component is not mounted
    if (!containerRef.current || !isMounted.current) return;

    // Define movement amount (adjust as needed)
    const scrollAmount = 200;

    // Check if scroll position hasn't reached the end
    if (scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth) {
      setScrollPosition(prevPosition => prevPosition + scrollAmount);
    } else {
      // Reset scroll position to beginning after reaching the end
      setScrollPosition(0);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(autoScroll, scrollSpeed);
    return () => {
      clearInterval(intervalId); // Cleanup on unmount
      // Update the isMounted ref when the component unmounts
      isMounted.current = false;
    };
  }, []); // Empty dependency array ensures useEffect runs only once

  return (
    <div className="package-container" ref={containerRef}>
      <div className="package">
        <h2>Basic Package</h2>
        <p>Features...</p>
        <button>Choose</button>
      </div>
      <div className="package">
        <h2>Advanced Package</h2>
        <p>Advanced Features...</p>
        <button>Choose</button>
      </div>
      <div className="package package--center">
        <h2>Premium Package</h2>
        <p>Highlighted Features...</p>
        <button>Choose (Recommended)</button>
      </div>
      <div className="package">
        <h2>Advanced Package</h2>
        <p>Advanced Features...</p>
        <button>Choose</button>
      </div>
      <div className="package">
        <h2>Advanced Package</h2>
        <p>Advanced Features...</p>
        <button>Choose</button>
      </div>
      <div className="package">
        <h2>Advanced Package</h2>
        <p>Advanced Features...</p>
        <button>Choose</button>
      </div>
    </div>
  );
}
