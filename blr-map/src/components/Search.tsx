import type { ChangeEvent } from "react";

interface SearchParams {
  onAddressInput: (inputAddress: string) => void
}

const Search = ({ onAddressInput }: SearchParams) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputAddress = (event.target as HTMLInputElement).value;
    onAddressInput(inputAddress);
  };
  return (
    <div className="search">
      <input type="text" onChange={handleInputChange} />
    </div>
  )
}

export default Search
