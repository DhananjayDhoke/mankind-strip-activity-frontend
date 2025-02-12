//export const BASEURL = 'http://localhost:8088'
export const BASEURL = 'https://mankindstipsportalapi.netcastservice.co.in'

export const PageCount = 20;
export const ImageLimit = 10;
export const DIGIT_REGEX = /^\d*$/

export const SelectStyle = {
    control: (provided, state) => ({
      ...provided,
      borderColor: "#1f8dd0", // Purple when focused, gray when not
      boxShadow: state.isFocused ? "0 0 0 1px #1f8dd0" : "none", // Focus glow
      "&:hover": {
        borderColor: "#1f8dd0", // Purple on hover
      },
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: 200, 
      overflowY: "auto",
      zIndex: 999999 
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: 200, 
    }),
  }