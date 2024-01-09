import { ItemProperty } from "../../types/Property";

const renderItemProperties = (properties: ItemProperty[], key?: string | number) => {
    if (properties.length) {
        const clone = structuredClone(properties);
        return clone.sort((a, b) => b.descriptionPriority - a.descriptionPriority).map((property, index) => property.formattedDescription ? <p key={`${key}-${index}-${property.property}-${property.stat}`}>{property.formattedDescription}</p> : null);
    } else {
        return null;
    } 
}

export default renderItemProperties;
