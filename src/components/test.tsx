import * as AutoComplete from 'react-autocomplete';
import { Col, Row, Grid, Table } from 'react-bootstrap';
import * as React from 'react';
import * as Request from 'request';
import State from './../interfaces/iState';
import './../App.css';

export default class Test extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        // Define initial state
        this.state = {
            showMenu: false,
            menuData: [{ abbr: '', stnName: '' }],
            stationData: { name: '', abbr: '', item: [] },
            showStation: false,
            error: '',
            value: ''
        };

        // Binding of functions
        this.handleSelection = this.handleSelection.bind(this);
        this.closeSelection = this.closeSelection.bind(this);
        this.displayStationName = this.displayStationName.bind(this);
    }

    /**
     * Request sent to backend on mount to receive menu data 
     */
    componentWillMount() {
        Request('http://localhost:3001', (err, res, body) => {
            if (err) {
                console.log('REQUEST ERROR', err);
            } else {
                // Parse data received from backend
                let parsed = JSON.parse(body);
                // Set state for menuData
                this.setState({
                    menuData: parsed
                });
            }
        });
    }

    /**
     * Function to handle closing a station selection
     * @param event Mouse event on close button
     */
    closeSelection(event: React.MouseEvent<HTMLElement>) {
        // Prevent window default from refreshing
        event.preventDefault();
        // Set state for showStation
        this.setState({
            showStation: false
        });
    }

    /**
     * Function for handing station that is clicked in menu
     * @param event Mouse event on selection
     */
    handleSelection(event: React.ChangeEvent<any>) {
        // Prevent window default from refreshing
        event.preventDefault();
        // Define payload to be sent to backend
        let postData = {
            stnName: event.target.id
        };

        // URL for backend
        let url = 'http://localhost:3001/test';
        // Options to be sent in POST
        let options = {
            method: 'post',
            body: postData,
            json: true,
            url: url
        };

        // Request post function
        Request.post(options, (err, res, body) => {
            // Error catch
            if (err) {
                console.log('REQUEST POST ERR', err);
            } else {
                /**
                 * Check to see if an error message was returned from api call.
                 */
                if (body.data.root.message) {
                    // Set state for error message
                    this.setState({
                        error: 'Unfortunately there seems to be an issue with that selection. Please select another station.'
                    });
                } else {
                    /**
                     * If no error set state for stationData, showStation, and empty for error
                     */
                    this.setState({
                        stationData: body.data.root.station,
                        showStation: true,
                        error: ''
                    });
                }
            }
        });
    }

    /**
     * Function to compare abbreviation in menuData and data returned from backend
     * If matched return full station name to be returned and displayed
     * @param str Abbreviation from API call to be compared to menuData abbreviation
     */
    displayStationName(str: string) {
        // Loop throught menuData
        for (let i = 0; i < this.state.menuData.length; i++) {
            // Compare each iteration to str param, and if matched return full name
            if (this.state.menuData[i].abbr === str.toLowerCase()) {
                return this.state.menuData[i].stnName;
            }
        }
        return true;
    }

    public render() {
        return (
            <Grid>
                <Row>
                    <Col lg={4} id="autocomplete-container">
                        <Row>
                            <Col lg={12}>
                                <h3 id="search-header">Select a Station</h3>
                            </Col>
                            <Col lg={12}>
                                <AutoComplete
                                    menuStyle={{
                                        borderRadius: '3px',
                                        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                                        background: 'rgba(255, 255, 255, 1)',
                                        padding: '2px 0',
                                        fontSize: '90%',
                                        position: 'fixed',
                                        overflow: 'auto',
                                        maxHeight: '25%',
                                        zIndex: 3,
                                        cursor: 'pointer',
                                    }}
                                    inputProps={{ placeholder: 'Search Station' }}
                                    items={this.state.menuData}
                                    shouldItemRender={(item, value) => item.stnName.toLowerCase().indexOf(value.toLowerCase()) > -1}
                                    getItemValue={item => item.stnName}
                                    renderItem={(item, highlighted) =>
                                        <div
                                            key={item.abbr}
                                            style={{ backgroundColor: highlighted ? '#eee' : 'transparent', color: '#000000' }}
                                        >
                                            <a id={item.abbr} onClick={this.handleSelection}> {item.stnName}</a>
                                        </div>
                                    }
                                    value={this.state.value}
                                    onChange={e => this.setState({ value: e.target.value })}
                                    onSelect={value => this.setState({ value })}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                    this.state.error
                        ? (
                            <Row>
                                <Col lg={12} id="error-container">
                                    <span><i>{this.state.error}</i></span>
                                </Col>
                            </Row>
                        )
                        : (
                            null
                        )
                }
                {
                    this.state.showStation
                        ? (
                            <Row>
                                <Col lg={12} id="table-container">
                                    <a className="close-btn" onClick={this.closeSelection}>X</a>
                                    <Row>
                                        <Col lg={12}>
                                            <h1 id="station-name">{this.state.stationData.name}</h1>
                                        </Col>
                                    </Row>
                                    <Table className="station-table" responsive={true}>
                                        <thead>
                                            <tr>
                                                <th>Route</th>
                                                <th>Dest</th>
                                                <th>Depart</th>
                                                <th>Arrive</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {this.state.stationData.item.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <th>
                                                            {item['@line'].replace('ROUTE', '')}
                                                        </th>
                                                        <th>
                                                            {this.displayStationName(item['@trainHeadStation'])}
                                                        </th>
                                                        <th>
                                                            {item['@origTime']}
                                                        </th>
                                                        <th>
                                                            {item['@destTime']}
                                                        </th>
                                                    </tr>
                                                );
                                            }, this)}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        )
                        : (
                            null
                        )
                }
            </Grid>
        );
    }
}