export default interface StateInterface {
    showMenu: boolean;
    menuData: Array<{abbr: string, stnName: string}>;
    stationData: {name: string, abbr: string, item: Array<{}>};
    showStation: boolean;
    error: string;
    value: string;
    showSearch: boolean;
}