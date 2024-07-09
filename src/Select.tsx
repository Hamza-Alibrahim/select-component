/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import styles from "./select.module.css";

export type SelectOptions = {
  label: string;
  value: string | number;
};

type SingleSelectProps = {
  value: SelectOptions | undefined;
  onChange: (value: SelectOptions | undefined) => void;
  options: SelectOptions[];
  multible?: false;
};

type MultibleSelectProps = {
  value: SelectOptions[];
  onChange: (value: SelectOptions[]) => void;
  options: SelectOptions[];
  multible: true;
};

type SelectProps =
  | ({
      options: SelectOptions[];
    } & SingleSelectProps)
  | MultibleSelectProps;

const Select = ({ multible, value, onChange, options }: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  function selectOption(option: SelectOptions) {
    if (multible) {
      if (value?.includes(option)) onChange(value.filter((e) => e !== option));
      else onChange([...value, option]);
    } else {
      if (value !== option) onChange(option);
    }
  }
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== containerRef.current) return;
      switch (e.code) {
        case "Enter":
        case "Space":
          setIsOpen((prev) => !prev);
          if (isOpen) selectOption(options[highlighted]);
          break;
        case "ArrowUp":
        case "ArrowDown": {
          if (!isOpen) {
            setIsOpen(true);
            break;
          }
          const newValue = highlighted + (e.code === "ArrowDown" ? 1 : -1);
          if (newValue >= 0 && newValue < options.length)
            setHighlighted(newValue);
          break;
        }
        case "Escape":
          setIsOpen(false);
          break;
      }
    };
    containerRef.current?.addEventListener("keydown", handler);
    return () => containerRef.current?.removeEventListener("keydown", handler);
  }, [isOpen, highlighted]);
  return (
    <div
      ref={containerRef}
      onClick={() => setIsOpen((prev) => !prev)}
      onBlur={() => {
        setIsOpen(false);
        setHighlighted(0);
      }}
      tabIndex={0}
      className={styles.container}
    >
      <span className={styles.value}>
        {multible
          ? value?.map((e) => {
              return (
                <button
                  className={styles.button}
                  key={e.value}
                  onClick={(el) => {
                    el.stopPropagation();
                    selectOption(e);
                  }}
                >
                  {e.label}
                  <span className={styles.span}>&times;</span>
                </button>
              );
            })
          : value?.label}
      </span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          multible ? onChange([]) : onChange(undefined);
        }}
        className={styles.clear}
      >
        &times;
      </button>
      <div className={styles.divider}></div>
      <div className={`${styles.caret} ${isOpen ? styles.open : ""}`}></div>
      <ul className={`${styles.options} ${isOpen ? styles.show : ""}`}>
        {options.map((e, i) => {
          return (
            <li
              onClick={(el) => {
                el.stopPropagation();
                selectOption(e);
                setIsOpen(false);
              }}
              key={e.value}
              className={`${styles.option} ${
                multible
                  ? value.includes(e)
                    ? styles.selected
                    : ""
                  : value === e
                  ? styles.selected
                  : ""
              } ${highlighted === i ? styles.highlighted : ""}`}
              onMouseEnter={() => {
                setHighlighted(i);
              }}
            >
              {e.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Select;
