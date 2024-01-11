import { ItemProperty, ItemPropertyDescription } from "../../types/Property";

const renderItemProperties = (properties: ItemProperty[], key?: string | number) => {
    if (properties.length) {
        const clone = structuredClone(properties);
        let descriptions: ItemPropertyDescription[] = [];

        clone.forEach(itemProperty => {
            descriptions = descriptions.concat(itemProperty.descriptions);
        });

        return descriptions.sort((a, b) => b.priority - a.priority).map((description, index) => <p key={`${key}-${index}`}>{description.text}</p>);

    } else {
        return null;
    } 
}

export default renderItemProperties;
