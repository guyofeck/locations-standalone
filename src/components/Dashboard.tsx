import React from 'react';
import './Dashboard.css';
import { Location } from '../types';
import {
    Table,
    TableActionCell,
    EmptyState,
    Image,
    Page,
    TextButton,
    WixDesignSystemProvider,
    Modal,
    MessageModalLayout,
    Button,
    Text,
    Input
} from "@wix/design-system";
const locations: Location[]  = [
    {
        name: "Tel Aviv",
        coord: {
            latitude: 32.0852997,
            longitude: 34.7818064
        }
    },
    {
        name: "Be'er Sheva",
        coord: {
            latitude: 31.2457442,
            longitude: 34.7925181
        }
    }
]

function Dashboard() {
    const columns = [
        { title: 'Name', width: '60%', render: (location: Location) => location.name },
        { title: 'Coords', width: '40%', render: (location: Location) => `${location.coord.latitude.toFixed(2)},${location.coord.longitude.toFixed(2)}` },
    ]

    return  (
        <Page>
            <Page.Header
                title="Our Locations"
                actionsBar={<Button>Update Locations</Button>}
            />
            <Page.Content>
                <Table data={locations} columns={columns} rowVerticalPadding="medium">
                    <Table.Content />
                </Table>
            </Page.Content>
        </Page>
    );
    ;
}

export default Dashboard;
