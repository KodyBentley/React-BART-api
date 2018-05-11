import * as AutoComplete from 'react-autocomplete';
import { Col, Row, Grid, Table } from 'react-bootstrap';
import * as React from 'react';
import * as Request from 'request';
import State from './../interfaces/iState';
import './../App.css';

export default class Test extends React.Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            showMenu: false,
            menuData: [{ abbr: '', stnName: '' }],
            stationData: undefined,
            showStation: false,
            error: '',
            value: ''
        };

        this.showMenu = this.showMenu.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.handleSelection = this.handleSelection.bind(this);
        this.closeSelection = this.closeSelection.bind(this);
        this.displayStationName = this.displayStationName.bind(this);
    }

    componentWillMount() {
        Request('http://localhost:3001', (err, res, body) => {
            if (err) {
                console.log('REQUEST ERROR', err);
            } else {
                let parsed = JSON.parse(body);
                this.setState({
                    menuData: parsed
                });
            }
        });
    }

    showMenu(event: any) {
        event.preventDefault();
        this.setState({ showMenu: true }, () => {
            document.addEventListener('click', this.closeMenu);
        });
    }

    closeMenu() {
        this.setState({ showMenu: false }, () => {
            document.removeEventListener('click', this.closeMenu);
        });
    }

    closeSelection(event: any) {
        event.preventDefault();
        this.setState({
            showStation: false
        });
    }

    handleSelection(event: any) {
        event.preventDefault();
        let postData = {
            stnName: event.target.id
        };

        let url = 'http://localhost:3001/test';
        let options = {
            method: 'post',
            body: postData,
            json: true,
            url: url
        };
        Request.post(options, (err, res, body) => {
            if (err) {
                console.log('REQUEST POST ERR', err);
                this.setState({
                    error: 'THERE WAS AN ERROR'
                });
            } else {
                console.log('body: ', body);
                if (body.data.root.message) {
                    this.setState({
                        error: 'Unfortunately there seems to be an issue with that selection. Please try again.'
                    });
                } else {
                    this.setState({
                        stationData: body.data.root.station,
                        showStation: true,
                        error: ''
                    });
                }
            }
        });
    }

    displayStationName(str: string) {
        for (let i = 0; i < this.state.menuData.length; i++) {
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
                <Row className="menu-row">
                    {/* <Col lg={12}>
                        <button onClick={this.showMenu}>
                            Select Station
                </button>
                    </Col> */}

                    {/* {
                        this.state.showMenu
                            ? (
                                <Col lg={2} className="menu">
                                    {this.state.menuData.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <a href="" key={item.abbr} id={item.abbr} onClick={this.handleSelection}> {item.stnName} </a>
                                            </div>
                                        );
                                    }, this)}
                                </Col>
                            )
                            : (
                                null
                            )
                    } */}
                </Row>
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
            </Grid>
        );
    }
}