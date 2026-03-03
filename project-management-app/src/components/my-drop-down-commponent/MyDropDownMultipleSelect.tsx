import {useMemo, useState} from "react";
import './MyDropDownMultipleSelect.css'

type Item = {
    key: string | number;
    value: string;
}

export const MyDropDownMultipleSelect = ({list}: { list: Item[] }) => {

    const [searchValue, setSearchValue] = useState<string>("")
    const [items, setItems] = useState<string[] | number[]>([])


    const filteredList = useMemo(() => {
        if (!searchValue.trim()) return list;

        const regex = new RegExp(searchValue, "i"); // case-insensitive
        return list.filter(item => regex.test(item.value));
    }, [searchValue]);

    return (

        <div className="my-custom-drop-multiple">

            <input type="text" value={searchValue} placeholder="Searcg by name"
                   onChange={(e) => setSearchValue(e.target.value)}
            />

            <div className="my-custom-drop-list">
                {
                    filteredList &&
                    filteredList.map((item: Item) => (

                        <div className="list-item" onClick={() => {

                        }}>
                            {item.value}
                        </div>
                    ))}
            </div>

        </div>

    )
}