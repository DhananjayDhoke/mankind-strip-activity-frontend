//export const BASEURL = 'http://localhost:8088'
export const BASEURL = 'https://mankindstipsportalapi.netcastservice.co.in'

export const PageCount = 20;
export const ImageLimit = 10;
export const DIGIT_REGEX = /^\d*$/

export const SelectStyle = {
    control: (provided, state) => ({
      ...provided,
      borderColor: "#1f8dd0", // Purple when focused, gray when not
      fontSize:"14px",
      fontWeight:"500",
      color:"#2f2483",
      boxShadow: state.isFocused ? "0 0 0 1px #1f8dd0" : "none", // Focus glow
      "&:hover": {
        borderColor: "#1f8dd0", // Purple on hover
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#2f2483", // Change placeholder color
      fontWeight: "600",
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: 200, 
      overflowY: "auto",
      zIndex: 999999,
      background:"#fff", 
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: 200, 
      color:"#2f2483",
    
    }),
  }