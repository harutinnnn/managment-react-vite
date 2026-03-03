import {useEffect, useMemo, useState} from "react";
import './MyDropDownMultipleSelect.css'
import { CircleCheckBig, X} from "lucide-react";

type Item = {
    key: number;
    value: string;
}


interface MyDropDownMultipleSelectPayload {
    list: Item[],
    setMembers: (memberIds: number[]) => void,
    selectedMembers: number[]
}

export const MyDropDownMultipleSelect: React.FC<MyDropDownMultipleSelectPayload> = (
    {
        list,
        setMembers,
        selectedMembers,
    }) => {

    const [searchValue, setSearchValue] = useState("");
    const [items, setItems] = useState<Item[]>([]);
    const [showList, setShowList] = useState(false);

    const filteredList = useMemo(() => {
                if (!searchValue.trim()) return list;
                const escaped = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const regex = new RegExp(escaped, "i");
                return list.filter(item => regex.test(item.value));
            }
            ,
            [searchValue, list]
        )
    ;


    useEffect(() => {
        setItems(list.filter(item => selectedMembers.includes(item.key)))
    }, []);


    const toggleItem = (item: Item) => {
        setItems(prev => {
            const exists = prev.find(ele => ele.key === item.key);
            let newItems;
            if (exists) {
                // Remove item
                newItems = prev.filter(ele => ele.key !== item.key);
            } else {
                // Add item
                newItems = [...prev, item];
            }

            // Schedule the parent update after this render
            setTimeout(() => {
                setMembers(newItems.map(i => i.key));
            }, 0);

            return newItems;
        });
    };

    const highlight = (text: string) => {
        if (!searchValue.trim()) return text;
        const escaped = searchValue.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const regex = new RegExp(`(${escaped})`, "gi");

        return text.split(regex).map((part, index) =>
            regex.test(part) ? <b key={index}>{part}</b> : part
        );
    };

    return (
        <div className="my-custom-drop-multiple">
            <div className="my-custom-drop-multiple-search-container">
                <div className="selected-items">
                    {items.map(item => (
                        <div className="selected-item" key={item.key}>
                            <span>{item.value}</span>
                            <X size={12} onClick={() => toggleItem(item)}/>
                        </div>
                    ))}
                </div>

                <input
                    type="text"
                    value={searchValue}
                    placeholder="Search by name"
                    onFocus={() => setShowList(true)}
                    onChange={e => setSearchValue(e.target.value)}
                />
            </div>

            {showList && (
                <div className="my-custom-drop-list">
                    {filteredList.map(item => (
                        <div
                            key={item.key}
                            className={"list-item " + (items.find(i => i.key === item.key) ? "selected" : "")}
                            onClick={e => {
                                e.stopPropagation();
                                toggleItem(item);
                            }}
                        >
                            <span>{highlight(item.value)}</span>
                            {items.find(i => i.key === item.key) && <CircleCheckBig size={14}/>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}