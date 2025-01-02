import React, { useState, useEffect } from "react";

const Typewriter = () => {
  const phrases = [
    `console.log("Hello, World!");`,
    `print("Hello, World!") `,
    `System.out.println("Hello, World!"); `,
    `echo "Hello, World!"; `,
    `cout << "Hello, World!";`,
    `Console.WriteLine("Hello, World!"); `,
    `printf("Hello, World!");`,
    `alert("Hello, World!"); `,
  ];

  const [currentPhrase, setCurrentPhrase] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const typingSpeed = 120;
  const deletingSpeed = 60;
  const pauseTime = 1000;

  useEffect(() => {
    let timer;
    if (!isDeleting && currentPhrase === phrases[phraseIndex]) {
      // Pause before deleting the current phrase
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && currentPhrase === "") {
      // Move to the next phrase after deleting
      setIsDeleting(false);
      setPhraseIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    } else {
      // Typing or deleting characters
      timer = setTimeout(
        () => {
          setCurrentPhrase((prevText) =>
            isDeleting
              ? prevText.slice(0, -1)
              : phrases[phraseIndex].slice(0, prevText.length + 1)
          );
        },
        isDeleting ? deletingSpeed : typingSpeed
      );
    }

    return () => clearTimeout(timer);
  }, [currentPhrase, isDeleting, phraseIndex, phrases]);

  return (
    <div className="w-full text-2xl font-mono text-white bg-black p-4 rounded-md ">
      <div className="bg-black rounded-lg p-4 shadow-inner">
        {/* Terminal header */}
        <div className="flex items-center mb-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Terminal content */}
        <div className=" font-mono  sm:text-xl md:text-2xl lg:text-4xl text-green-400">
          <span>{currentPhrase}</span>
          <span className="animate-pulse">|</span>
        </div>
      </div>
    </div>
  );
};

export default Typewriter;
