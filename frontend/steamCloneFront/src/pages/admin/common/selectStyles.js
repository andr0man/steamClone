import { bool } from "prop-types";

const selectStyles = {
  control: (styles, { isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled ? "#23232a" : "#23232a",
    borderColor: isDisabled ? "#353545" : "#353545",
    color: isDisabled ? "#888" : "#fff",
    boxShadow: "none",
    borderRadius: "6px",
    minHeight: "38px",
    fontFamily: "inherit",
  }),
  menu: (styles) => ({
    ...styles,
    backgroundColor: "#23232a",
    borderRadius: "8px",
    color: "#fff",
    fontFamily: "inherit",
  }),
  option: (styles, { isFocused, isSelected, isDisabled }) => ({
    ...styles,
    backgroundColor: isDisabled
      ? "#23232a"
      : isSelected
      ? "linear-gradient(90deg, #a178eb 0%, #66c0f4 100%)"
      : isFocused
      ? "#353545"
      : "#23232a",
    color: isDisabled ? "#888" : "#fff",
    cursor: isDisabled ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    opacity: isDisabled ? 0.6 : 1,
    zIndex: 100,
  }),
  multiValue: (styles) => ({
    ...styles,
    backgroundColor: "#353545",
    color: "#fff",
    borderRadius: "6px",
    fontFamily: "inherit",
  }),
  multiValueLabel: (styles) => ({
    ...styles,
    color: "#fff",
    fontFamily: "inherit",
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: "#a178eb",
    ":hover": {
      backgroundColor: "#a178eb",
      color: "#fff",
    },
  }),
  input: (styles) => ({
    ...styles,
    color: "#fff",
    fontFamily: "inherit",
  }),
  placeholder: (styles) => ({
    ...styles,
    fontFamily: "inherit",
    fontWeight: "500",
  }),
  singleValue: (styles, { isDisabled }) => ({
    ...styles,
    color: isDisabled ? "#8888887e" : "#fff",
    backgroundColor: isDisabled ? "#23232a" : "#23232a",
    borderColor: isDisabled ? "#353545" : "#353545",
    fontFamily: "inherit",
    cursor: isDisabled ? "not-allowed" : "pointer",
  }),
  indicatorSeparator: (styles) => ({ ...styles, backgroundColor: "#353545" }),
  dropdownIndicator: (styles) => ({ ...styles, color: "#a178eb" }),
  clearIndicator: (styles) => ({ ...styles, color: "#a178eb" }),
};

export default selectStyles;
