import { createContext, useState } from "react";
import props from "prop-types";

const UserContext = createContext();
const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: props.node.isRequired,
};
export { UserContext, UserProvider };
