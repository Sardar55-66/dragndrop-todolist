import React, { useState } from "react";
import '../styles/styles.scss';
import Framework7React, { Searchbar } from 'framework7-react';
import Framework7 from "framework7/types";

interface HeaderProps {
    onSearchQueryChange: (query: string) => void;
  }

  const Header: React.FC<HeaderProps> = ({ onSearchQueryChange }) => {
    Framework7.use(Framework7React);

    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearchQueryChange(query);
    };
    return (
        <div className="header">
            <h1>Your Tasks</h1>
            <Searchbar
                placeholder="Поиск..."
                backdrop={true}
                disableButton={false}
                value={searchQuery}
                onChange={handleSearchInput}
                >
            </Searchbar>
        </div>
    )
}

export default Header;