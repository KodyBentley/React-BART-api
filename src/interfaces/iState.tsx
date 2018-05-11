export default interface StateInterface {
    showMenu: boolean;
    menuData: Array<{abbr: string, stnName: string}>;
    stationData: any;
    showStation: boolean;
    error: string;
    value: string;
}