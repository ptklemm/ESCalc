import { createContext } from 'react';
import ItemCatalog from './ItemCatalog';

class EasternSunCatalog {
    public items: ItemCatalog;

    constructor() {
        this.items = new ItemCatalog();
    }
}

export const EasternSunCatalogContext = createContext(new EasternSunCatalog());
