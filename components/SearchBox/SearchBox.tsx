import css from "./SearchBox.module.css";

import { useEffect, useState } from "react";

interface SearchBoxProps {
  onSearchChange: (word: string) => void;
}

export default function SearchBox({ onSearchChange }: SearchBoxProps) {
  const [text, setText] = useState("");

  function handleChange(ev: React.ChangeEvent<HTMLInputElement>) {
    setText(ev.target.value);
  }

  useEffect(() => {
    onSearchChange(text);
  }, [text, onSearchChange]);

  return (
    <input
      onChange={handleChange}
      value={text}
      className={css.input}
      type="text"
      placeholder="Search notes"
    />
  );
}