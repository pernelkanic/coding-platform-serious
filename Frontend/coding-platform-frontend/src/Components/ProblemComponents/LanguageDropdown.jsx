import { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { LanguageOptions } from '../../Constants/LanguageOptions';
export default function LanguageDropdown  ({ onSelectChange })  {
const[val , setval] = useState(null);
  return (
    <div className=" w-50">
    <Dropdown
      placeholder={`Choose a Language`}
      options={LanguageOptions.map((item)=> {
        return item.name
      })}
      value={val}
      defaultValue={LanguageOptions[0]}
      onChange={(e) => {
        setval(e.value)
        onSelectChange(e.value)}}
    />
    

    </div>
  );
};

