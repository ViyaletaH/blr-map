import { ChangeEvent, useState, KeyboardEventHandler } from "react";

interface SearchParams {
  onAddressInput: (inputAddress: string) => void
}

const Search = ({ onAddressInput }: SearchParams) => {
  const [inputAddress, setInputAddress] = useState<string>('');

  const handleSearch = (event: KeyboardEventHandler<HTMLInputElement>) => {
    if (event.key === 'Enter' && inputAddress.length) {
      onAddressInput(inputAddress);
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputAddress(event.target.value);
  };
  
  return (
    <div className="search">
      <input type="text" onKeyDown={handleSearch} onChange={handleInputChange} />
    </div>
  )
}

export default Search
