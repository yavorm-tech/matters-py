import {useState} from 'react';
export const Autocomplete = ({options}) => {
    const [value, setValue] = useState();
    const [showSuggestions, setShowSuggestions] =  useState(false);
    const suggestions = options;
    const handleChange = event => {
        setValue(event.target.value);
    }
    return (
        <div className="container">
            <input 
                value={value}
                placeholder="Search" />
            {showSuggestions}    
        </div>
    )
}