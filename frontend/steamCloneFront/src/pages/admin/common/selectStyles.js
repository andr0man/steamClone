const selectStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "#23232a",
    borderColor: "#353545",
    color: "#fff",
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
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "linear-gradient(90deg, #a178eb 0%, #66c0f4 100%)"
      : isFocused
      ? "#353545"
      : "#23232a",
    color: isSelected ? "#fff" : "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
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
  input: (styles) => ({ ...styles, color: "#fff", fontFamily: "inherit" }),
  placeholder: (styles) => ({
    ...styles,
    color: "#625874ff",
    fontFamily: "inherit",
  }),
  singleValue: (styles) => ({
    ...styles,
    color: "#fff",
    fontFamily: "inherit",
  }),
  indicatorSeparator: (styles) => ({ ...styles, backgroundColor: "#353545" }),
  dropdownIndicator: (styles) => ({ ...styles, color: "#a178eb" }),
  clearIndicator: (styles) => ({ ...styles, color: "#a178eb" }),
};

export default selectStyles;
