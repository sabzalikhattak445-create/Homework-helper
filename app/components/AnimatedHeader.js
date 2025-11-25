"use client";
import { useState, useEffect } from "react";

export default function AnimatedHeader() {
  const words = ["▪︎●Ishfaq●Asim●Talha●▪︎"];
  const [display, setDisplay] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    let adding = true;

    const interval = setInterval(() => {
      if (adding) {
        setDisplay(words[0].slice(0, i + 1));
        i++;
        if (i >= words[0].length) adding = false;
      } else {
        setDisplay(words[0].slice(0, i - 1));
        i--;
        if (i <= 0) adding = true;
      }
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return <h1 style={{ fontSize: 28, textAlign: "center" }}>{display}</h1>;
}
