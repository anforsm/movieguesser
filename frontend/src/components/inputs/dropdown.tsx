import { useRef, useState } from "react";
import useOnClickOutside from "hooks/useOnClickOutside";
import { MdKeyboardArrowDown } from "react-icons/md";

const Dropdown = (props: any) => {
  const [showOptions, setShowOptions] = useState(false);
  const [currOption, setCurrOption] = useState(
    props.default ? props.default : props.options[0]
  );
  const [currHoverOption, setCurrHoverOption] = useState<any>();
  const dropdownRef = useRef<any>();
  useOnClickOutside(dropdownRef, () => setShowOptions(false));

  return (
    <div ref={dropdownRef} className="relative inline-block min-w-[3em]">
      <button
        onClick={() => setShowOptions((prev) => !prev)}
        className="primary flex h-full items-center text-left"
      >
        <span className="border-r-[1px] border-r-text-col px-2">
          {currOption}
        </span>
        <span className="float-right px-1">
          <MdKeyboardArrowDown />
        </span>
      </button>
      {showOptions && (
        <div className="absolute bg-primary-700">
          {props.options.map((option: string) => (
            <button
              key={option}
              className={`block w-full px-2 text-left ${
                currHoverOption === option ? "bg-primary-600" : ""
              }`}
              onMouseEnter={() => setCurrHoverOption(option)}
              onClick={() => {
                setCurrOption(option);
                setShowOptions(false);
                props.onSelect(option);
              }}
            >
              <span>{option}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
